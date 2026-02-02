// proxy.js antes middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; 

export async function proxy(request) {
  // 1. Obtenemos la cookie de sesion que es el token
  const token = request.cookies.get('session_token')?.value;

  // 2. Identificamos la ruta a la que quiere acceder 
  const { pathname } = request.nextUrl;

  // 3. Si quiere entrar en la carpeta dashboard
  if (pathname.startsWith('/dashboard')) {
    
    // Si no hay token, lo mandamos al login (/auth)
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    try {
      // Si hay token, usamos el "molde" para verificar el sello
      // Recuerda: usamos TextEncoder porque la llave debe ser binaria
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      
      // Intentamos verificar. Si el token es falso o expiró, saltará al catch
      await jwtVerify(token, secret);
      
      // Si el sello es auténtico, ¡adelante!
      return NextResponse.next();
    } catch (error) {
      // Si el carnet es falso, lo expulsamos al login
      console.log("Token inválido o expirado");
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Para el resto de la web (Home, etc.), no pedimos carnet
  return NextResponse.next();
}

// CONFIGURACIÓN: Aquí le decimos al guardia qué pasillos vigilar
export const config = {
  // Vigila /dashboard y cualquier cosa que haya dentro
  matcher: ['/dashboard/:path*'], 
};