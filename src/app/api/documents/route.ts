import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: { expedition: { select: { reference: true, client: { select: { nom: true } } } } }
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.document.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
