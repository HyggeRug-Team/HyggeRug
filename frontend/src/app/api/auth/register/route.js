import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Tu conexión a MySQL
import bcrypt from 'bcryptjs';

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
    // Ajustamos los nombres a tu script: nickname, email, password_hash y auth_provider
    await db.query(
      'INSERT INTO users (nickname, email, password_hash, auth_provider) VALUES (?, ?, ?, ?)',
      [nickname, email, hashedPassword, 'credentials'] // 'credentials' porque no es de Google
    );

    return NextResponse.json(
      { message: '¡Usuario creado con éxito! Ya puedes iniciar sesión.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Hubo un error en el servidor. Inténtalo más tarde.' },
      { status: 500 }
    );
  }
}