import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.fournisseur.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ref = 'FRN-' + String(Date.now()).slice(-6);
    const { delaiProductionMoyen, ...rest } = body;
    const data = await prisma.fournisseur.create({
      data: { reference: ref, ...rest, delaiProductionMoyen: delaiProductionMoyen ? Number(delaiProductionMoyen) : null },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
