import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conteneurId = searchParams.get('conteneurId');
    const expeditionId = searchParams.get('expeditionId');
    const where: any = {};
    if (conteneurId) where.conteneurId = Number(conteneurId);
    if (expeditionId) where.expeditionId = Number(expeditionId);
    const data = await prisma.depense.findMany({ 
      where, 
      orderBy: { date: 'desc' }, 
      include: { 
        conteneur: { select: { numero: true } }, 
        expedition: { select: { reference: true } } 
      } 
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const montant = Number(body.montant);
    let montantXaf = body.montantXaf ? Number(body.montantXaf) : null;
    if (!montantXaf && body.devise === 'XAF') montantXaf = montant;
    const data = await prisma.depense.create({
      data: {
        conteneurId: body.conteneurId ? Number(body.conteneurId) : null, 
        expeditionId: body.expeditionId ? Number(body.expeditionId) : null,
        date: body.date ? new Date(body.date) : undefined,
        type: body.type, 
        montant, 
        devise: body.devise || 'XAF',
        tauxChange: body.tauxChange ? Number(body.tauxChange) : null, 
        montantXaf,
        description: body.description, 
        fournisseur: body.fournisseur,
        titre: body.titre, 
        categoriePersonnalisee: body.categoriePersonnalisee,
        liaison: body.liaison, 
        justificatifType: body.justificatifType, 
        justificatifPath: body.justificatifPath,
      }
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
