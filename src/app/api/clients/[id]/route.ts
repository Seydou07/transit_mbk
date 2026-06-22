import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await prisma.client.findUnique({
      where: { id: Number(id) },
      include: { expeditions: true, _count: true }
    });
    if (!data) return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    delete body.id; delete body._count;
    const { plafondCredit, ...rest } = body;
    const client = await prisma.client.update({
      where: { id: Number(id) },
      data: { ...rest, plafondCredit: plafondCredit !== undefined ? (plafondCredit ? Number(plafondCredit) : null) : undefined },
      include: { _count: { select: { expeditions: true } } }
    });
    return NextResponse.json(client);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await prisma.client.delete({ where: { id: Number(id) } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
