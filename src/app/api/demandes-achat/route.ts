import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.demandeAchat.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: true },
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.demandeAchat.count();
    const reference = `DA-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const data = await prisma.demandeAchat.create({
      data: { ...body, reference, clientId: Number(body.clientId), quantiteDemandee: Number(body.quantiteDemandee), budgetEstime: body.budgetEstime ? Number(body.budgetEstime) : null, dateSouhaitee: body.dateSouhaitee ? new Date(body.dateSouhaitee) : null },
      include: { client: true },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
