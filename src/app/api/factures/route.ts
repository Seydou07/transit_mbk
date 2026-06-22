import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const conteneurId = searchParams.get('conteneurId');
    const where: any = {};
    if (clientId) where.clientId = Number(clientId);
    if (conteneurId) where.conteneurId = Number(conteneurId);
    const data = await prisma.facture.findMany({ where, orderBy: { date: 'desc' }, include: { client: { select: { nom: true } }, expedition: { select: { reference: true } }, conteneur: { select: { numero: true } } } });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const numero = 'FAC-' + String(Date.now()).slice(-8);
    const montantHt = Number(body.montantHt);
    const tauxTva = body.tauxTva ? Number(body.tauxTva) : 18.00;
    const montantTva = montantHt * (tauxTva / 100);
    const montantTtc = montantHt + montantTva;
    const data = await prisma.facture.create({
      data: { numero, clientId: Number(body.clientId), expeditionId: Number(body.expeditionId), conteneurId: body.conteneurId ? Number(body.conteneurId) : null, date: body.date ? new Date(body.date) : undefined, montantHt, tauxTva, montantTva, montantTtc, devise: body.devise || 'XAF', statut: body.statut || 'EMISE', dateEcheance: body.dateEcheance ? new Date(body.dateEcheance) : null, notes: body.notes }
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
