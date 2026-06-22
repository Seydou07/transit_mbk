import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await prisma.expedition.findUnique({
      where: { id: Number(id) },
      include: {
        client: true,
        marchandises: true,
        conteneurs: true,
        documents: true
      }
    });
    if (!data) return NextResponse.json({ error: 'Expédition non trouvée' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    delete body.id; delete body._count; delete body.client;
    
    const dataToSave: any = {
      ...body,
      clientId: body.clientId ? Number(body.clientId) : undefined,
      fournisseurId: body.fournisseurId ? Number(body.fournisseurId) : null,
      coutExpedition: body.coutExpedition !== undefined ? (body.coutExpedition ? Number(body.coutExpedition) : null) : undefined,
      argentRecu: body.argentRecu !== undefined ? (body.argentRecu ? Number(body.argentRecu) : null) : undefined,
      poidsTotalKg: body.poidsTotalKg !== undefined ? (body.poidsTotalKg ? Number(body.poidsTotalKg) : null) : undefined,
      nombreColis: body.nombreColis !== undefined ? (body.nombreColis ? Number(body.nombreColis) : null) : undefined,
      dateDepartPrevue: body.dateDepartPrevue !== undefined ? (body.dateDepartPrevue ? new Date(body.dateDepartPrevue) : null) : undefined,
      dateArriveePrevue: body.dateArriveePrevue !== undefined ? (body.dateArriveePrevue ? new Date(body.dateArriveePrevue) : null) : undefined,
    };
    
    const data = await prisma.expedition.update({
      where: { id: Number(id) },
      data: dataToSave,
      include: { client: true, _count: { select: { marchandises: true, conteneurs: true } } }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PUT expeditions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.expedition.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
