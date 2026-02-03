import { NextResponse } from 'next/server';

export async function POST() {
  // 1. Creamos la respuesta primero
  const response = NextResponse.json({ 
    message: 'Sesión cerrada con éxito' 
  });

  // 2. Borramos la cookie directamente en la respuesta
  // Esto fuerza al navegador a recibir la cabecera "Set-Cookie" de borrado
  response.cookies.delete('session_token');

  return response;
}