import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await prisma.suiviProductionEtape.findUnique({ where: { id: Number(id) }, include: { expedition: { include: { client: true } } } });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await prisma.suiviProductionEtape.update({
      where: { id: Number(id) },
      data: {
        expeditionId: body.expeditionId ? Number(body.expeditionId) : undefined,
        date: body.date ? new Date(body.date) : undefined,
        etape: body.etape, commentaire: body.commentaire, photos: body.photos, documents: body.documents,
      },
      include: { expedition: { include: { client: true } } },
    });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await prisma.suiviProductionEtape.delete({ where: { id: Number(id) } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
