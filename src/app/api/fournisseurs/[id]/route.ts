import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await prisma.fournisseur.findUnique({ where: { id: Number(id) } });
    if (!data) return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    delete body.id; delete body.reference;
    const { delaiProductionMoyen, ...rest } = body;
    const data = await prisma.fournisseur.update({
      where: { id: Number(id) },
      data: { ...rest, delaiProductionMoyen: delaiProductionMoyen ? Number(delaiProductionMoyen) : null },
    });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await prisma.fournisseur.delete({ where: { id: Number(id) } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
