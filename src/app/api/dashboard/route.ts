import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      // Statistiques conteneurs
      conteneursEnCours, // Préparation, Chargement, En transit, Dédouanement
      conteneursArrives,
      conteneursClotures,
      clientsActifs,
      
      // Finance
      recettesPrevues, // Total factures émises
      recettesEncaissees, // Total paiements
      depensesTotal,
      
      // Dépenses par catégorie
      depensesParCategorieRaw,
      
      // Conteneurs occupation
      conteneursOccupationRaw,
      
      // Activity by month
      facturesPourMois,
      depensesPourMois,
      
      // Clients débiteurs
      clientsDebiteursRaw,
    ] = await Promise.all([
      // Conteneurs
      prisma.conteneur.count({ where: { statut: { in: ['EN_PREPARATION', 'CHARGE', 'EN_TRANSIT', 'DOUANE'] } } }),
      prisma.conteneur.count({ where: { statut: 'ARRIVE' } }),
      prisma.conteneur.count({ where: { statut: 'FERME' } }),
      prisma.client.count({ where: { statut: 'ACTIF' } }),
      
      // Finance
      prisma.facture.aggregate({ _sum: { montantTtc: true } }),
      prisma.paiement.aggregate({ _sum: { montantXaf: true } }),
      prisma.depense.aggregate({ _sum: { montantXaf: true } }),
      
      // Dépenses par catégorie
      prisma.depense.groupBy({ by: ['type'], _sum: { montantXaf: true } }),
      
      // Conteneurs occupation
      prisma.conteneur.findMany({ 
        where: { statut: { not: 'FERME' } },
        include: { expeditions: true } 
      }),
      
      // Activity by month
      prisma.facture.findMany({ select: { date: true, montantTtc: true } }),
      prisma.depense.findMany({ select: { date: true, montantXaf: true } }),
      
      // Clients débiteurs
      prisma.facture.groupBy({ 
        by: ['clientId'], 
        _sum: { montantTtc: true }, 
        where: { statut: { in: ['EMISE', 'EN_RETARD'] } } 
      }),
    ]);

    const depensesParCategorie = depensesParCategorieRaw.map((d: any) => ({
      name: d.type.charAt(0) + d.type.slice(1).toLowerCase(),
      value: Number(d._sum.montantXaf || 0)
    }));
    
    const conteneursOccupation = conteneursOccupationRaw.map((c: any) => {
      const capacite = Number(c.capaciteMaxCbm || 0);
      const usedCBM = c.expeditions.reduce((sum: number, exp: any) => sum + Number(exp.cbmEmbarque || 0), 0);
      return {
        name: c.numero,
        usedCBM: usedCBM,
        remainingCBM: Math.max(0, capacite - usedCBM)
      };
    });
    
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const activityMap: Record<string, { name: string, recettes: number, depenses: number }> = {};
    months.forEach(m => activityMap[m] = { name: m, recettes: 0, depenses: 0 });
    
    facturesPourMois.forEach((f: any) => {
      if (!f.date) return;
      const mName = months[new Date(f.date).getMonth()];
      if (activityMap[mName]) activityMap[mName].recettes += Number(f.montantTtc || 0);
    });
    depensesPourMois.forEach((d: any) => {
      if (!d.date) return;
      const mName = months[new Date(d.date).getMonth()];
      if (activityMap[mName]) activityMap[mName].depenses += Number(d.montantXaf || 0);
    });
    const activityByMonth = months.map(m => activityMap[m]);
    
    const clientIds = clientsDebiteursRaw.map((c: any) => c.clientId);
    const clients = await prisma.client.findMany({ where: { id: { in: clientIds } }, select: { id: true, nom: true } });
    const clientMap = new Map(clients.map((c: any) => [c.id, c.nom]));
    
    const clientsDebiteurs = clientsDebiteursRaw.map((c: any) => ({
      name: clientMap.get(c.clientId) || `Client ${c.clientId}`,
      value: Number(c._sum.montantTtc || 0)
    })).sort((a: any, b: any) => b.value - a.value).slice(0, 5);

    return NextResponse.json({
      stats: {
        conteneursEnCours,
        conteneursArrives,
        conteneursClotures,
        clientsActifs,
        recettesPrevues: Number(recettesPrevues._sum.montantTtc || 0),
        recettesEncaissees: Number(recettesEncaissees._sum.montantXaf || 0),
        depensesTotal: Number(depensesTotal._sum.montantXaf || 0),
        beneficeEstime: Number(recettesPrevues._sum.montantTtc || 0) - Number(depensesTotal._sum.montantXaf || 0),
      },
      depensesParCategorie,
      conteneursOccupation,
      activityByMonth,
      clientsDebiteurs,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des métriques' }, { status: 500 });
  }
}
