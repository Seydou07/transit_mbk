import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { expeditions: true } } }
    });
    return NextResponse.json(clients);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ref = `CLI-${Date.now().toString(36).toUpperCase()}`;
    const { plafondCredit, ...rest } = body;
    const client = await prisma.client.create({
      data: { reference: ref, ...rest, plafondCredit: plafondCredit ? Number(plafondCredit) : null },
      include: { _count: { select: { expeditions: true } } }
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
