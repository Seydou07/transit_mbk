import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('GET expeditions called');
    
    // 1. Récupérer les expéditions
    const expeditions = await prisma.expedition.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // 2. Récupérer les clients existants
    const clientIds = [...new Set(expeditions.map(e => e.clientId))];
    const clients = await prisma.client.findMany({
      where: { id: { in: clientIds } }
    });
    const clientMap = new Map(clients.map(c => [c.id, c]));
    
    // 3. Récupérer les counts
    const expeditionsWithCounts = await Promise.all(
      expeditions.map(async (e) => {
        const [marchandisesCount, conteneursCount] = await Promise.all([
          prisma.marchandise.count({ where: { expeditionId: e.id } }),
          prisma.expeditionConteneur.count({ where: { expeditionId: e.id } })
        ]);
        
        return {
          ...e,
          client: clientMap.get(e.clientId) || null,
          _count: {
            marchandises: marchandisesCount,
            conteneurs: conteneursCount
          }
        };
      })
    );
    
    console.log('GET expeditions returning data:', expeditionsWithCounts);
    return NextResponse.json(expeditionsWithCounts);
  } catch (error) { 
    console.error('GET expeditions error:', error);
    return NextResponse.json([]); 
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('POST expeditions received body:', body);
    const ref = `EXP-${Date.now().toString(36).toUpperCase()}`;
    
    const dataToSave: any = {
      reference: ref,
      clientId: Number(body.clientId),
      fournisseurId: body.fournisseurId ? Number(body.fournisseurId) : null,
      typeCommande: body.typeCommande || 'TRANSIT',
      typeTransport: body.typeTransport || 'MARITIME',
      statut: body.statut || 'EN_ATTENTE',
      portOrigine: body.portOrigine || null,
      paysOrigine: body.paysOrigine || null,
      portDestination: body.portDestination || null,
      paysDestination: body.paysDestination || null,
      incoterm: body.incoterm || 'FOB',
      devise: body.devise || 'USD',
      coutExpedition: body.coutExpedition ? Number(body.coutExpedition) : null,
      argentRecu: body.argentRecu ? Number(body.argentRecu) : null,
      poidsTotalKg: body.poidsTotalKg ? Number(body.poidsTotalKg) : null,
      nombreColis: body.nombreColis ? Number(body.nombreColis) : null,
      dateDepartPrevue: body.dateDepartPrevue ? new Date(body.dateDepartPrevue) : null,
      dateArriveePrevue: body.dateArriveePrevue ? new Date(body.dateArriveePrevue) : null,
      notes: body.notes || null,
    };
    console.log('POST expeditions saving:', dataToSave);
    
    const data = await prisma.expedition.create({
      data: dataToSave,
      include: { client: true, _count: { select: { marchandises: true, conteneurs: true } } }
    });
    console.log('POST expeditions created:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('POST expeditions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
