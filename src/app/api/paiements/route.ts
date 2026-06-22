import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const expeditionId = searchParams.get('expeditionId');
    
    let where = {};
    if (expeditionId) {
      where = { expeditionId: Number(expeditionId) };
    }
    
    const data = await prisma.paiement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { expedition: { select: { reference: true, client: { select: { nom: true } } } } }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET paiements error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.paiement.create({
      data: {
        expeditionId: Number(body.expeditionId),
        date: body.date ? new Date(body.date) : new Date(),
        montant: Number(body.montant),
        devise: body.devise || 'XAF',
        tauxChange: body.tauxChange ? Number(body.tauxChange) : null,
        montantXaf: body.montantXaf ? Number(body.montantXaf) : null,
        type: body.type || 'ACOMPTE',
        modePaiement: body.modePaiement || null,
        reference: body.reference || null,
        referenceTransaction: body.referenceTransaction || null,
        montantFacture: body.montantFacture ? Number(body.montantFacture) : null,
        resteAPayer: body.resteAPayer ? Number(body.resteAPayer) : null,
        pieceJointe: body.pieceJointe || null,
        notes: body.notes || null
      }
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('POST paiements error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    
    const data = await prisma.paiement.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        date: rest.date ? new Date(rest.date) : undefined,
        montant: rest.montant ? Number(rest.montant) : undefined,
        tauxChange: rest.tauxChange ? Number(rest.tauxChange) : undefined,
        montantXaf: rest.montantXaf ? Number(rest.montantXaf) : undefined,
        montantFacture: rest.montantFacture ? Number(rest.montantFacture) : undefined,
        resteAPayer: rest.resteAPayer ? Number(rest.resteAPayer) : undefined
      }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PUT paiements error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await prisma.paiement.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE paiements error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
