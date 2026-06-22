import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const marchandises = await prisma.marchandise.findMany({
      where: { expeditionId: Number(id) },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(marchandises);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const marchandise = await prisma.marchandise.create({
      data: {
        expeditionId: Number(id),
        description: body.description,
        categorie: body.categorie,
        quantite: Number(body.quantite),
        unite: body.unite || 'pcs',
        poidsUnitaire: body.poidsUnitaire ? Number(body.poidsUnitaire) : null,
        poidsTotalKg: body.poidsTotalKg ? Number(body.poidsTotalKg) : null,
        valeurUnitaire: body.valeurUnitaire ? Number(body.valeurUnitaire) : null,
        valeurTotale: body.valeurTotale ? Number(body.valeurTotale) : null,
        nombreColis: body.nombreColis ? Number(body.nombreColis) : null,
        notes: body.notes
      }
    });
    return NextResponse.json(marchandise, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
