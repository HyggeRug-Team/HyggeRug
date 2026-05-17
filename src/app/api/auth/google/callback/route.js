/**
 * @file app/api/auth/callback/google/route.js
 * @description Callback de Google OAuth. Gestiona el login y registro de usuarios
 *              mediante Google, y genera una sesión con el mismo payload estandarizado
 *              que el login manual, usando buildSessionPayload de auth.js.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, buildSessionPayload } from '@/lib/auth'; // Añadimos buildSessionPayload
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import { sendWelcomeEmail } from "@/lib/mailer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateFromGoogle = searchParams.get('state');

  const cookieStore = await cookies();
  const stateFromCookie = cookieStore.get('oauth_state')?.value;

  // Verificamos que el estado de Google coincide con el nuestro (protección CSRF)
  if (!stateFromGoogle || stateFromGoogle !== stateFromCookie) {
    return NextResponse.redirect(new URL('/auth?error=invalid_state', request.url));
  }

  try {
    // 1. Canjeamos el código por los tokens de Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) throw new Error("No access_token");

    // 2. Pedimos los datos del perfil del usuario a Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userResponse.json();

    // 3. Buscamos si el usuario ya existe por su email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [googleUser.email]);
    let user = rows[0];

    // Sube la foto de Google a Vercel Blob y devuelve la URL permanente
    const uploadProfileImage = async (imageUrl, nickname) => {
      try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const blob = await put(`avatars/${nickname}-${Date.now()}.jpg`, arrayBuffer, {
          access: 'public',
          contentType,
        });
        return blob.url;
      } catch (error) {
        console.error("Error subiendo a Vercel Blob:", error);
        return imageUrl; // Fallback a la URL de Google si falla
      }
    };

    if (!user) {
      // 4a. Usuario nuevo: subimos foto, insertamos en BD y recuperamos el objeto completo
      const vercelBlobUrl = await uploadProfileImage(googleUser.picture, googleUser.name);

      const [result] = await db.query(
        'INSERT INTO users (nickname, email, auth_provider, google_id, profile_image) VALUES (?, ?, ?, ?, ?)',
        [googleUser.name, googleUser.email, 'google', googleUser.sub, vercelBlobUrl]
      );

      // Recuperamos el usuario recién insertado para tener todos los campos de la BD
      // (rol por defecto, hygge_points, etc.) y poder construir el payload completo
      const [newUserRows] = await db.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
      user = newUserRows[0];

      // Enviamos email de bienvenida sin bloquear el flujo si falla
      try {
        await sendWelcomeEmail(googleUser.email, googleUser.name);
        console.log(`✅ Correo de bienvenida enviado a: ${googleUser.email}`);
      } catch (mailError) {
        console.error('❌ Error enviando email:', mailError);
      }

      console.log("🆕 Nuevo usuario con foto en Vercel Blob:", googleUser.email);

    } else {
      // 4b. Usuario existente: actualizamos foto y google_id si hace falta
      let updateFields = [];
      let queryParams = [];

      if (!user.google_id) {
        updateFields.push('google_id = ?', 'auth_provider = "google"');
        queryParams.push(googleUser.sub);
      }

      // Actualizamos siempre la foto para tener la versión más reciente de Google
      const nuevaFotoVercel = await uploadProfileImage(googleUser.picture, user.nickname);
      updateFields.push('profile_image = ?');
      queryParams.push(nuevaFotoVercel);

      queryParams.push(user.user_id);
      await db.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
        queryParams
      );

      // Recuperamos el usuario actualizado para tener todos los campos frescos
      const [updatedRows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user.user_id]);
      user = updatedRows[0];

      // ¿El usuario está activo?
      if (user.active === 0 || user.active === false) {
        return NextResponse.redirect(new URL('/auth?error=blocked', request.url));
      }

      console.log("✅ Usuario actualizado con éxito");
    }

    // 5. Creamos el token con el mismo payload estandarizado que el login manual
    const token = await createSession(buildSessionPayload(user));

    // 6. Redirigimos al inicio con la cookie de sesión establecida
    const response = NextResponse.redirect(new URL('/', request.url));

    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 15, // 15 días, igual que el login manual
      path: '/',
    });

    // Limpiamos la cookie temporal del state OAuth
    response.cookies.delete('oauth_state');

    return response;

  } catch (error) {
    console.error('Error en el callback de Google:', error);
    return NextResponse.redirect(new URL('/auth?error=auth_failed', request.url));
  }
}