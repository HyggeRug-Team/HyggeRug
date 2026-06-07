// ENDPOINT DE INICIO DE SESIÓN — Verifica las credenciales del usuario, genera el token JWT y abre su sesión.
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, buildSessionPayload } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { getConfigValue } from '@/lib/db/config';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    // Rate limiting: máximo 10 intentos por IP en 15 minutos
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(`login:${ip}`, { max: 10, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // Mensaje genérico para no revelar si el email existe
    const credentialsError = NextResponse.json(
      { error: 'Email o contraseña incorrectos.' },
      { status: 401 }
    );

    if (!user) return credentialsError;

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return credentialsError;

    // ¿El usuario está activo?
    if (user.active === 0 || user.active === false) {
      const contactEmail = await getConfigValue('contact_email').catch(() => null) || 'contacto@hyggerug.com';
      return NextResponse.json(
        { error: `Tu cuenta ha sido bloqueada. Ponte en contacto con ${contactEmail}` },
        { status: 403 }
      );
    }

    // 5. ¡ÉXITO! Creamos el Token (Payload)
    const token = await createSession(buildSessionPayload(user));

    // 5. Guardamos el token en una COOKIE
    // Esto es lo que el Proxy revisará en cada página
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true, // Seguridad: el navegador no puede tocarla con JS
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 15, // 15 dias de vida
      path: '/',
    });

    return NextResponse.json({ message: 'Login correcto', user: { nickname: user.nickname } });

  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}