import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Borramos la cookie dándole una fecha de expiración pasada
  cookieStore.delete('session_token');

  return NextResponse.json({ message: 'Sesión cerrada con éxito' });
}