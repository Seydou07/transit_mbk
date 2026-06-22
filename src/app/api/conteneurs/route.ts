import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.conteneur.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { expeditions: true } } }
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { capaciteMaxCbm, capaciteMaxKg, dateChargement, ...rest } = body;
    const data = await prisma.conteneur.create({
      data: {
        ...rest,
        capaciteMaxCbm: capaciteMaxCbm ? Number(capaciteMaxCbm) : null,
        capaciteMaxKg: capaciteMaxKg ? Number(capaciteMaxKg) : null,
        dateChargement: dateChargement ? new Date(dateChargement) : null,
      },
      include: { _count: { select: { expeditions: true } } }
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
