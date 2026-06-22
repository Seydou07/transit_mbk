import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const conteneurId = Number(id);
    const [conteneur, depenses, factures, expeditions] = await Promise.all([
      prisma.conteneur.findUnique({ where: { id: conteneurId } }),
      prisma.depense.findMany({ where: { conteneurId }, orderBy: { date: 'desc' } }),
      prisma.facture.findMany({ where: { conteneurId }, include: { client: true }, orderBy: { date: 'desc' } }),
      prisma.expeditionConteneur.findMany({ where: { conteneurId }, include: { expedition: { include: { client: true, paiements: true } } } }),
    ]);
    if (!conteneur) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const totalDepenses = depenses.reduce((s, d) => s + Number(d.montantXaf || d.montant), 0);
    const recettesPrevues = factures.reduce((s, f) => s + Number(f.montantTtc), 0);
    const recettesEncaissees = expeditions.reduce((s, ec) => s + ec.expedition.paiements.reduce((sp, p) => sp + Number(p.montantXaf || p.montant), 0), 0);
    const restesAEncaisser = recettesPrevues - recettesEncaissees;
    const profitActuel = recettesEncaissees - totalDepenses;
    const profitEstime = recettesPrevues - totalDepenses;
    const marge = recettesPrevues > 0 ? ((profitEstime / recettesPrevues) * 100).toFixed(1) : '0';

    return NextResponse.json({
      conteneur,
      depenses,
      factures,
      expeditions: expeditions.map(ec => ({
        expedition: ec.expedition,
        cbmEmbarque: ec.cbmEmbarque,
        poidsEmbarque: ec.poidsEmbarque,
        colisEmbarques: ec.colisEmbarques,
        valeurEmbarquee: ec.valeurEmbarquee,
      })),
      finance: {
        totalDepenses,
        recettesPrevues,
        recettesEncaissees,
        restesAEncaisser,
        profitActuel,
        profitEstime,
        marge: Number(marge),
        depensesParType: depenses.reduce((acc: any, d) => {
          acc[d.type] = (acc[d.type] || 0) + Number(d.montantXaf || d.montant);
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
