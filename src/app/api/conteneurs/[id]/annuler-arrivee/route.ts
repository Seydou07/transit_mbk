import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const conteneurId = Number(id);

    const conteneur = await prisma.conteneur.findUnique({
      where: { id: conteneurId },
      include: { expeditions: { include: { expedition: { select: { id: true } } } } }
    });
    if (!conteneur) return NextResponse.json({ error: 'Conteneur introuvable' }, { status: 404 });

    for (const exp of conteneur.expeditions) {
      await prisma.expedition.update({
        where: { id: exp.expedition.id },
        data: { statut: 'EN_TRANSIT' }
      });
    }

    const data = await prisma.conteneur.update({
      where: { id: conteneurId },
      data: { statut: 'EN_TRANSIT' },
    });

    return NextResponse.json({ success: true, conteneur: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
