import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, buildSessionPayload } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getConfigValue } from '@/lib/db/config';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Buscamos al usuario por su email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    // Se coge el 0 porque la segunda son metadatos de la consulta que no sirven para nada
    const user = rows[0];

    // 2. ¿El usuario existe?
    if (!user) {
      return NextResponse.json({ error: 'El usuario no existe.' }, { status: 401 });
    }

    // 3. ¿La contraseña es correcta? 
    // Comparamos la que escribió el usuario con la encriptada de la DB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
    }

    // 4. ¿El usuario está activo?
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