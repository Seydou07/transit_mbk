import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.actif) {
      return NextResponse.json({ error: 'Identifiants invalides ou compte inactif' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.motDePasse);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    // Mettre à jour la date de dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { dernierConnexion: new Date() },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Envoyer le token dans un cookie httpOnly
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 jour
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
