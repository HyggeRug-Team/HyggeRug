import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Tu conexión a MySQL
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; // Para crear el token

export async function POST(request) {
  try {
    // 1. Extraemos los datos que vienen del formulario
    const { nickname, email, password } = await request.json();

    // 2. Validación rápida: ¿Vienen todos los datos?
    if (!nickname || !email || !password) {
      return NextResponse.json(
        { error: 'Por favor, rellena todos los campos.' },
        { status: 400 }
      );
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

    // 4. SEGURIDAD: Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. INSERTAMOS en la base de datos
    // Guardamos la respuesta que da mysql que en ella lleva el id del usuario que se ha añadido para crear despues la sesion
    const [result] = await db.query(
      'INSERT INTO users (nickname, email, password_hash, auth_provider) VALUES (?, ?, ?, ?)',
      [nickname, email, hashedPassword, 'credentials'] // 'credentials' porque no es de Google
    );
    const userId = result.insertId;
    // A. Creamos el token (igual que en el login)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: userId, email, nickname })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h') // Duración de la sesión
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
      maxAge: 7200, // 2 horas en segundos
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