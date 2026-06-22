import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const conteneurId = Number(id);

    const data = await prisma.conteneur.update({
      where: { id: conteneurId },
      data: { statut: 'DOUANE' },
    });

    return NextResponse.json({ success: true, conteneur: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
