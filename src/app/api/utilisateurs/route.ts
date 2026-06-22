import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, nom: true, email: true, role: true, actif: true, dernierConnexion: true, createdAt: true },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nom, email, motDePasse, role } = await request.json();
    const hashed = await bcrypt.hash(motDePasse, 10);
    const user = await prisma.user.create({
      data: { nom, email, motDePasse: hashed, role },
      select: { id: true, nom: true, email: true, role: true, actif: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, nom, email, motDePasse, role } = await request.json();
    const data: any = { nom, email, role };
    if (motDePasse) {
      data.motDePasse = await bcrypt.hash(motDePasse, 10);
    }
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, nom: true, email: true, role: true, actif: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, actif } = await request.json();
    const user = await prisma.user.update({
      where: { id },
      data: { actif },
      select: { id: true, nom: true, email: true, role: true, actif: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
