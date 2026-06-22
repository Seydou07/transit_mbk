import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const conteneurId = Number(id);
    const [depenses, expeditionLinks] = await Promise.all([
      prisma.depense.aggregate({ where: { conteneurId }, _sum: { montantXaf: true } }),
      prisma.expeditionConteneur.findMany({
        where: { conteneurId },
        include: { expedition: { select: { coutExpedition: true, argentRecu: true } } }
      }),
    ]);
    const totalDepenses = depenses._sum.montantXaf ? Number(depenses._sum.montantXaf) : 0;
    const totalCout = expeditionLinks.reduce((sum, link) => sum + (Number(link.expedition.coutExpedition) || 0), 0);
    const totalRecu = expeditionLinks.reduce((sum, link) => sum + (Number(link.expedition.argentRecu) || 0), 0);
    const profit = totalCout - totalDepenses;

    const data = await prisma.conteneur.update({
      where: { id: conteneurId },
      data: { statut: 'FERME', clotureProfit: profit, clotureLe: new Date() },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
