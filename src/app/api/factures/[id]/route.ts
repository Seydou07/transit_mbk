import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await prisma.facture.findUnique({ where: { id: Number(id) }, include: { client: true, expedition: { include: { marchandises: true } }, conteneur: true } });
    if (!data) return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    delete body.id; delete body.numero;
    if (body.montantHt) {
      body.montantHt = Number(body.montantHt);
      body.tauxTva = body.tauxTva ? Number(body.tauxTva) : 18.00;
      body.montantTva = body.montantHt * (body.tauxTva / 100);
      body.montantTtc = body.montantHt + body.montantTva;
    }
    if (body.clientId) body.clientId = Number(body.clientId);
    if (body.expeditionId) body.expeditionId = Number(body.expeditionId);
    if (body.conteneurId) body.conteneurId = body.conteneurId ? Number(body.conteneurId) : null;
    if (body.date) body.date = new Date(body.date);
    if (body.dateEcheance) body.dateEcheance = new Date(body.dateEcheance);
    const data = await prisma.facture.update({ where: { id: Number(id) }, data: body });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.facture.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
