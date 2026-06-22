import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const stock = await prisma.stock.findMany({
      orderBy: { dateMiseEnStock: 'desc' },
      include: {
        client: true,
        expedition: true,
        marchandise: true,
        _count: { select: { livraisons: true } }
      }
    });
    const totals = {
      totalPoids: stock.reduce((acc, s) => acc + Number(s.poidsRestantKg || 0), 0),
      totalQuantite: stock.reduce((acc, s) => acc + s.quantiteRestante, 0),
      totalLignes: stock.length,
    };
    return NextResponse.json({ stock, totals });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du stock' }, { status: 500 });
  }
}
