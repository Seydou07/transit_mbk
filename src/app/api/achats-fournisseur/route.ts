import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.achatFournisseur.findMany({
      orderBy: { dateCommande: 'desc' },
      include: { expedition: true, fournisseur: true },
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.achatFournisseur.create({
      data: {
        expeditionId: Number(body.expeditionId),
        fournisseurId: Number(body.fournisseurId),
        dateCommande: body.dateCommande ? new Date(body.dateCommande) : new Date(),
        montantAchat: body.montantAchat ? Number(body.montantAchat) : null,
        devise: body.devise || 'CNY',
        tauxConversion: body.tauxConversion ? Number(body.tauxConversion) : null,
        montantFcfa: body.montantFcfa ? Number(body.montantFcfa) : null,
        acompte: body.acompte ? Number(body.acompte) : null,
        dateAcompte: body.dateAcompte ? new Date(body.dateAcompte) : null,
        solde: body.solde ? Number(body.solde) : null,
        dateDebutProduction: body.dateDebutProduction ? new Date(body.dateDebutProduction) : null,
        dateFinPrevue: body.dateFinPrevue ? new Date(body.dateFinPrevue) : null,
        dateFinReelle: body.dateFinReelle ? new Date(body.dateFinReelle) : null,
        bl: body.bl, factureFournisseur: body.factureFournisseur,
        photo: body.photo, notes: body.notes,
      },
      include: { expedition: true, fournisseur: true },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
