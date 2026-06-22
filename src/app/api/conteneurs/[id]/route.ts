import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const url = new URL(request.url);
    const incl = url.searchParams.get('include') || '';
    const include: any = {};
    if (incl.includes('expeditions')) include.expeditions = { include: { expedition: { include: { client: true, marchandises: true } } } };
    if (incl.includes('depenses')) include.depenses = true;
    if (incl.includes('factures')) include.factures = true;
    const data = await prisma.conteneur.findUnique({ where: { id: Number(id) }, include });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    delete body.id; delete body._count;
    const { capaciteMaxCbm, capaciteMaxKg, dateChargement, ...rest } = body;
    const data = await prisma.conteneur.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        capaciteMaxCbm: capaciteMaxCbm !== undefined ? (capaciteMaxCbm ? Number(capaciteMaxCbm) : null) : undefined,
        capaciteMaxKg: capaciteMaxKg !== undefined ? (capaciteMaxKg ? Number(capaciteMaxKg) : null) : undefined,
        dateChargement: dateChargement !== undefined ? (dateChargement ? new Date(dateChargement) : null) : undefined,
      },
      include: { _count: { select: { expeditions: true } } }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await prisma.conteneur.delete({ where: { id: Number(id) } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
