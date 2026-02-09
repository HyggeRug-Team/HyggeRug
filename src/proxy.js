import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request) {
  //1. Guardamos el token
  const token = request.cookies.get('session_token')?.value;
  // 2. Guardamos si la sesion es correcta
  let okToken = false;

  // Comprobamos si el token es valido si existe
  if (token) {
    // El try es necesario porque jwtVerify reponde con una excepción si no es correcto
    try {
      // 1. 
      // Guardamos la variable guardada en .env.local y la convertimos a binario (jose solo usa unit8Array)
      const secretKey = process.env.JWT_SECRET;
      
      if (!secretKey) {
        console.error("Error: La variable JWT_SECRET no está definida en el entorno.");
      } else {
        const secret = new TextEncoder().encode(secretKey);
        await jwtVerify(token, secret);
        okToken = true;
      }
      // -----------------------

    } catch (error) {
    //   response.cookies.delete('session_token');
      console.log("Token corrupto: instrucción de borrado añadida a la respuesta.");
    }
  }

  // Identificamos la ruta a la que quiere acceder para filtrar el trafico sin sesion
  const { pathname } = request.nextUrl;

  // Si quiere entrar en la carpeta dashboard con un token invalido
  if (pathname.startsWith('/dashboard') && !okToken) {
    // Guardo la respuesta de redirigir a auth (ruta unificada)
    const response = NextResponse.redirect(new URL('/auth', request.url));
    // Si el token existe, es decir que es un token invalido se añade a la respuesta borrar la cookie
    if (token) response.cookies.delete('session_token'); 
    return response;
  }

  // Si un usuario con sesion intenta entrar en /auth se le redirige a dashboard
  if (pathname.startsWith('/auth') && okToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Para el resto de la web (Home, etc.), no pedimos carnet
  return NextResponse.next();
}

// CONFIGURACIÓN: Aquí le decimos al guardia qué pasillos vigilar
export const config = {
  // Vigila /dashboard y cualquier cosa que haya dentro, y auth page
  matcher: ['/dashboard/:path*', '/auth'],
};