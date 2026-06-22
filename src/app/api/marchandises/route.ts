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
    
    const data = await prisma.marchandise.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { expedition: { select: { reference: true } } }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.marchandise.create({
      data: {
        expeditionId: Number(body.expeditionId),
        description: body.description,
        categorie: body.categorie || null,
        marque: body.marque || null,
        modele: body.modele || null,
        referenceFournisseur: body.referenceFournisseur || null,
        quantite: Number(body.quantite),
        unite: body.unite || 'pcs',
        poidsUnitaire: body.poidsUnitaire ? Number(body.poidsUnitaire) : null,
        poidsTotalKg: body.poidsTotalKg ? Number(body.poidsTotalKg) : null,
        longueurCm: body.longueurCm ? Number(body.longueurCm) : null,
        largeurCm: body.largeurCm ? Number(body.largeurCm) : null,
        hauteurCm: body.hauteurCm ? Number(body.hauteurCm) : null,
        cbm: body.cbm ? Number(body.cbm) : null,
        prixUnitaireAchat: body.prixUnitaireAchat ? Number(body.prixUnitaireAchat) : null,
        prixUnitaireVente: body.prixUnitaireVente ? Number(body.prixUnitaireVente) : null,
        valeurUnitaire: body.valeurUnitaire ? Number(body.valeurUnitaire) : null,
        valeurTotale: body.valeurTotale ? Number(body.valeurTotale) : null,
        nombreColis: body.nombreColis ? Number(body.nombreColis) : null,
        notes: body.notes || null
      }
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    
    const data = await prisma.marchandise.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        quantite: rest.quantite ? Number(rest.quantite) : undefined,
        poidsUnitaire: rest.poidsUnitaire ? Number(rest.poidsUnitaire) : undefined,
        poidsTotalKg: rest.poidsTotalKg ? Number(rest.poidsTotalKg) : undefined,
        longueurCm: rest.longueurCm ? Number(rest.longueurCm) : undefined,
        largeurCm: rest.largeurCm ? Number(rest.largeurCm) : undefined,
        hauteurCm: rest.hauteurCm ? Number(rest.hauteurCm) : undefined,
        cbm: rest.cbm ? Number(rest.cbm) : undefined,
        prixUnitaireAchat: rest.prixUnitaireAchat ? Number(rest.prixUnitaireAchat) : undefined,
        prixUnitaireVente: rest.prixUnitaireVente ? Number(rest.prixUnitaireVente) : undefined,
        valeurUnitaire: rest.valeurUnitaire ? Number(rest.valeurUnitaire) : undefined,
        valeurTotale: rest.valeurTotale ? Number(rest.valeurTotale) : undefined,
        nombreColis: rest.nombreColis ? Number(rest.nombreColis) : undefined
      }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await prisma.marchandise.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
