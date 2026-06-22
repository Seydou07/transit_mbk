import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const conteneurId = Number(id);

    const conteneur = await prisma.conteneur.findUnique({
      where: { id: conteneurId },
      select: { statut: true }
    });
    if (!conteneur) return NextResponse.json({ error: 'Conteneur introuvable' }, { status: 404 });

    const hasExpeditions = await prisma.expeditionConteneur.count({ where: { conteneurId } });

    const data = await prisma.conteneur.update({
      where: { id: conteneurId },
      data: { statut: hasExpeditions > 0 ? 'CHARGE' : 'EN_PREPARATION' },
    });

    return NextResponse.json({ success: true, conteneur: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
