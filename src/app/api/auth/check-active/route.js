// ENDPOINT DE VERIFICACIÓN DE ESTADO — Comprueba si la cuenta del usuario sigue activa en la base de datos.
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ active: false });
    }
    const [rows] = await db.query('SELECT active FROM users WHERE user_id = ?', [userId]);
    const user = rows[0];
    // By default, if the user doesn't exist or is not blocked, return active: true
    return NextResponse.json({ active: user ? (user.active !== 0 && user.active !== false) : false });
  } catch (err) {
    console.error('Error in check-active API:', err);
    return NextResponse.json({ active: false });
  }
}
