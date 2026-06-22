import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await prisma.demandeAchat.findUnique({ where: { id: Number(id) }, include: { client: true } });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await prisma.demandeAchat.update({
      where: { id: Number(id) },
      data: { ...body, clientId: body.clientId ? Number(body.clientId) : undefined, quantiteDemandee: body.quantiteDemandee ? Number(body.quantiteDemandee) : undefined, budgetEstime: body.budgetEstime ? Number(body.budgetEstime) : null, dateSouhaitee: body.dateSouhaitee ? new Date(body.dateSouhaitee) : null },
      include: { client: true },
    });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await prisma.demandeAchat.delete({ where: { id: Number(id) } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
