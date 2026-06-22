import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const conteneurId = Number(id);
    const data = await prisma.expeditionConteneur.create({
      data: {
        conteneurId,
        expeditionId: Number(body.expeditionId),
        cbmEmbarque: body.cbmEmbarque ? Number(body.cbmEmbarque) : null,
        poidsEmbarque: body.poidsEmbarque ? Number(body.poidsEmbarque) : null,
        colisEmbarques: body.colisEmbarques ? Number(body.colisEmbarques) : null,
        notes: body.notes,
      },
      include: { expedition: true },
    });
    await prisma.conteneur.update({
      where: { id: conteneurId },
      data: { statut: 'CHARGE' },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
