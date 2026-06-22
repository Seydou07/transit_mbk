import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    delete body.id;
    if (body.montant) body.montant = Number(body.montant);
    if (body.montantXaf) body.montantXaf = Number(body.montantXaf);
    if (body.tauxChange) body.tauxChange = Number(body.tauxChange);
    if (body.conteneurId) body.conteneurId = Number(body.conteneurId);
    if (body.date) body.date = new Date(body.date);
    const data = await prisma.depense.update({ where: { id: Number(id) }, data: body });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await prisma.depense.delete({ where: { id: Number(id) } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
