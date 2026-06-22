import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.suiviProductionEtape.findMany({
      orderBy: { date: 'desc' },
      include: { expedition: { include: { client: true } } },
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.suiviProductionEtape.create({
      data: {
        expeditionId: Number(body.expeditionId),
        date: body.date ? new Date(body.date) : new Date(),
        etape: body.etape,
        commentaire: body.commentaire, photos: body.photos, documents: body.documents,
      },
      include: { expedition: { include: { client: true } } },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
