import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await prisma.achatFournisseur.findUnique({ where: { id: Number(id) }, include: { expedition: true, fournisseur: true } });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data = await prisma.achatFournisseur.update({
      where: { id: Number(id) },
      data: {
        expeditionId: body.expeditionId ? Number(body.expeditionId) : undefined,
        fournisseurId: body.fournisseurId ? Number(body.fournisseurId) : undefined,
        dateCommande: body.dateCommande ? new Date(body.dateCommande) : undefined,
        montantAchat: body.montantAchat !== undefined ? Number(body.montantAchat) : undefined,
        devise: body.devise, tauxConversion: body.tauxConversion ? Number(body.tauxConversion) : null,
        montantFcfa: body.montantFcfa ? Number(body.montantFcfa) : null,
        acompte: body.acompte ? Number(body.acompte) : null,
        dateAcompte: body.dateAcompte ? new Date(body.dateAcompte) : null,
        solde: body.solde ? Number(body.solde) : null,
        bl: body.bl, factureFournisseur: body.factureFournisseur,
        photo: body.photo, notes: body.notes,
      },
      include: { expedition: true, fournisseur: true },
    });
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { await prisma.achatFournisseur.delete({ where: { id: Number(id) } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
