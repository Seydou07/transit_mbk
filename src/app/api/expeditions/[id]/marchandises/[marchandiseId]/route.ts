import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; marchandiseId: string }> }) {
  const { id, marchandiseId } = await params;
  try {
    const body = await request.json();
    const marchandise = await prisma.marchandise.update({
      where: { id: Number(marchandiseId), expeditionId: Number(id) },
      data: body
    });
    return NextResponse.json(marchandise);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; marchandiseId: string }> }) {
  const { id, marchandiseId } = await params;
  try {
    await prisma.marchandise.delete({
      where: { id: Number(marchandiseId), expeditionId: Number(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
