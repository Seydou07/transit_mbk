import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const livraisons = await prisma.livraison.findMany({
      include: { client: true, expedition: true, stock: true },
      orderBy: { dateLivraison: 'desc' },
    });
    return NextResponse.json(livraisons);
  } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stockId, quantite, destinataire, contactDestinataire, adresseLivraison, dateLivraison, notes } = body;

    const stock = await prisma.stock.findUnique({ where: { id: Number(stockId) } });
    if (!stock) return NextResponse.json({ error: 'Stock introuvable' }, { status: 404 });

    const qty = Number(quantite || body.quantiteRetiree);
    if (qty > stock.quantiteRestante) {
      return NextResponse.json({ error: 'Quantité insuffisante en stock' }, { status: 400 });
    }

    const livraison = await prisma.livraison.create({
      data: {
        stockId: stock.id,
        expeditionId: stock.expeditionId,
        clientId: stock.clientId,
        quantiteRetiree: qty,
        retraitPar: destinataire || body.retraitPar,
        notes: notes || body.notes,
        dateLivraison: dateLivraison ? new Date(dateLivraison) : new Date(),
      },
    });

    const newQuantite = stock.quantiteRestante - qty;
    await prisma.stock.update({
      where: { id: stockId },
      data: {
        quantiteRestante: newQuantite,
        statut: newQuantite === 0 ? 'RETIRE' : newQuantite < stock.quantiteInitiale ? 'PARTIELLEMENT_RETIRE' : 'EN_STOCK',
      },
    });

    const expedition = await prisma.expedition.findUnique({
      where: { id: stock.expeditionId },
      include: { stocks: true },
    });
    if (expedition) {
      const allRetired = expedition.stocks.every(s => s.quantiteRestante === 0);
      const someRetired = expedition.stocks.some(s => s.quantiteRestante < s.quantiteInitiale);
      await prisma.expedition.update({
        where: { id: stock.expeditionId },
        data: { statut: allRetired ? 'LIVRE' : someRetired ? 'PARTIELLEMENT_LIVRE' : 'EN_STOCK' },
      });
    }

    return NextResponse.json(livraison, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
