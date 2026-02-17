import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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

    // 4. ¡ÉXITO! Creamos el Token (Payload)
    const token = await createSession({
      userId: user.user_id,
      nickname: user.nickname,
      profileImage: user.profile_image,
      email: user.email,
      role: user.role,
      hyggePoints: user.hygge_points,
      // Esto si es == google no mostramos el cambiar contraseña por ejemplo
      authProvider: user.auth_provider,
    });

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