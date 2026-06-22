import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const conteneurId = Number(id);
    const expeditionId = Number(body.expeditionId);

    await prisma.expeditionConteneur.deleteMany({
      where: { conteneurId, expeditionId }
    });

    const remaining = await prisma.expeditionConteneur.count({ where: { conteneurId } });

    if (remaining === 0) {
      await prisma.conteneur.update({
        where: { id: conteneurId },
        data: { statut: 'EN_PREPARATION' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
