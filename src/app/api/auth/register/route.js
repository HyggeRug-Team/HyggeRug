// ENDPOINT DE REGISTRO — Crea la cuenta del usuario, cifra la contraseña y envía el correo de bienvenida.
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { sendWelcomeEmail } from '@/lib/mailer';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    // Rate limiting: máximo 5 registros por IP en 1 hora
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(`register:${ip}`, { max: 5, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Demasiados intentos de registro. Inténtalo más tarde.' },
        { status: 429 }
      );
    }

    const { nickname, email, password } = await request.json();

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { error: 'Por favor, rellena todos los campos.' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'El formato del email no es válido.' }, { status: 400 });
    }

    // 3. Comprobamos si el usuario ya existe en MySQL
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ? OR nickname = ?',
      [email, nickname]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'El email o el nombre de usuario ya están registrados.' },
        { status: 400 }
      );
    }

    // 4. SEGURIDAD: Encriptamos la contraseña (12 rondas es el estándar actual)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. INSERTAMOS en la base de datos
    // Guardamos la respuesta que da mysql que en ella lleva el id del usuario que se ha añadido para crear despues la sesion
    const [result] = await db.query(
      'INSERT INTO users (nickname, email, password_hash, auth_provider) VALUES (?, ?, ?, ?)',
      [nickname, email, hashedPassword, 'credentials'] // 'credentials' porque no es de Google
    );
    const userId = result.insertId;

    // Enviamos email de bienvenida
    try {
        await sendWelcomeEmail(email, nickname);
        console.log(`✅ Correo de bienvenida enviado a: ${email}`);
    } catch (mailError) {
        // Logueamos el error pero no cortamos el registro
        console.error('❌ Error enviando email:', mailError);
    }

    // A. Creamos el token (igual que en el login)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: userId, email, nickname })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15d') // Duración de la sesión
      .sign(secret);

    // B. Creamos la respuesta de éxito
    const response = NextResponse.json(
      { message: '¡Usuario creado e iniciado sesión con éxito!' },
      { status: 201 }
    );

    // C. Guardamos el token en la cookie "session_token"
    response.cookies.set('session_token', token, {
      httpOnly: true, // Por seguridad, para que no se acceda desde JS
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 15, // 15 días
    });

    return response;

  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Hubo un error en el servidor. Inténtalo más tarde.' },
      { status: 500 }
    );
  }
}