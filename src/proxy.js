import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request) {
  const token = request.cookies.get('session_token')?.value;
  let okToken = false;
  let isBlocked = false;

  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        console.error('Error: JWT_SECRET no está definido.');
      } else {
        const secret = new TextEncoder().encode(secretKey);
        const { payload } = await jwtVerify(token, secret);

        try {
          const origin = request.nextUrl.origin;
          const checkRes = await fetch(
            `${origin}/api/auth/check-active?userId=${payload.userId}`,
            { headers: { 'x-internal-key': secretKey } }
          );
          if (checkRes.ok) {
            const data = await checkRes.json();
            if (data.active) {
              okToken = true;
            } else {
              okToken = false;
              isBlocked = true;
            }
          } else {
            // Si el servicio interno falla, permitimos el acceso para evitar bloqueos
            okToken = true;
          }
        } catch {
          okToken = true;
        }
      }
    } catch {
      // Token inválido o expirado
    }
  }

  const { pathname } = request.nextUrl;
  const protectedRoutes =
    pathname.startsWith('/dashboard') || pathname.startsWith('/crear-diseno');

  if (protectedRoutes && !okToken) {
    const redirectUrl = isBlocked
      ? new URL('/auth?error=blocked', request.url)
      : new URL('/auth', request.url);
    const response = NextResponse.redirect(redirectUrl);
    if (token) response.cookies.delete('session_token');
    return response;
  }

  if (pathname.startsWith('/auth') && okToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/crear-diseno/:path*', '/auth'],
};
