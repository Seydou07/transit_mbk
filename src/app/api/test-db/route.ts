import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('=== TEST DB START ===');
    
    // Voir tous les clients
    const clients = await prisma.client.findMany({ select: { id: true, nom: true, reference: true } });
    console.log('CLIENTS:', clients);
    
    // Voir toutes les expéditions
    const expeditions = await prisma.expedition.findMany({
      select: { id: true, reference: true, clientId: true, createdAt: true }
    });
    console.log('EXPEDITIONS:', expeditions);
    
    console.log('=== TEST DB END ===');
    
    return NextResponse.json({ clients, expeditions });
  } catch (error: any) {
    console.error('TEST DB ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
