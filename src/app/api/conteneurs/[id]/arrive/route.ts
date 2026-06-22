import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const conteneurId = Number(id);

    // 1. Mettre à jour le conteneur
    const conteneur = await prisma.conteneur.update({
      where: { id: conteneurId },
      data: {
        statut: 'ARRIVE',
        dateArriveeReelle: new Date(),
      },
      include: { expeditions: { include: { expedition: { include: { client: true, marchandises: true } } } } }
    });

    // 2. Pour chaque expédition liée : créer stock et mettre à jour statut
    for (const expeditionConteneur of conteneur.expeditions) {
      const expedition = expeditionConteneur.expedition;

      // Mettre à jour statut de l'expédition
      await prisma.expedition.update({
        where: { id: expedition.id },
        data: { statut: 'ARRIVE' }
      });

      // Créer stock pour chaque marchandise de l'expédition
      for (const marchandise of expedition.marchandises) {
        // Vérifier si le stock existe déjà pour cette marchandise
        const existingStock = await prisma.stock.findFirst({
          where: {
            expeditionId: expedition.id,
            marchandiseId: marchandise.id
          }
        });

        if (!existingStock) {
          await prisma.stock.create({
            data: {
              expeditionId: expedition.id,
              clientId: expedition.clientId,
              marchandiseId: marchandise.id,
              description: marchandise.description,
              quantiteInitiale: marchandise.quantite,
              quantiteRestante: marchandise.quantite,
              poidsInitialKg: marchandise.poidsTotalKg,
              poidsRestantKg: marchandise.poidsTotalKg,
              statut: 'EN_STOCK'
            }
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Conteneur marqué comme arrivé, stock créé',
      conteneur
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du conteneur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
