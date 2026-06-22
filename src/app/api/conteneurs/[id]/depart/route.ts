import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const conteneurId = Number(id);

    const data = await prisma.conteneur.update({
      where: { id: conteneurId },
      data: {
        statut: 'EN_TRANSIT',
        dateDepart: body.dateDepart ? new Date(body.dateDepart) : new Date(),
        dateArriveeEstimee: body.dateArriveeEstimee ? new Date(body.dateArriveeEstimee) : undefined,
      },
      include: { expeditions: { include: { expedition: { select: { id: true, statut: true } } } } }
    });

    for (const exp of data.expeditions) {
      await prisma.expedition.update({
        where: { id: exp.expedition.id },
        data: { statut: 'EN_TRANSIT' }
      });
    }

    return NextResponse.json({ success: true, conteneur: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
