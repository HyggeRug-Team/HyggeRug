import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // conexión a BD
import { createSession } from '@/lib/auth'; // Generar sesion
import { cookies } from 'next/headers';
import { put } from '@vercel/blob'; // Para guardar las imagenes
import { sendWelcomeEmail } from "@/lib/mailer"; // Para enviar el email de bienvenida

export async function GET(request) {
    // Google devuelve dos datos, uno es el codigo necesario para pedir mas datos (code) y el codigo que le dimos antes para comprobar si la solicitud es nuestra (state)
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const stateFromGoogle = searchParams.get('state');

    const cookieStore = await cookies();
    const stateFromCookie = cookieStore.get('oauth_state')?.value;

    // Si el estado de google es false o no concuerda con el codigo nuestro
    if (!stateFromGoogle || stateFromGoogle !== stateFromCookie) {
        return NextResponse.redirect(new URL('/auth?error=invalid_state', request.url));
    }

    try {
        // 2. Canjeamos el código por los tokens de Google
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
        // Si no hay token de acceso es que no tenemos los datos del cliente
        if (!tokens.access_token) throw new Error("No access_token");

        // 3. Pedimos los datos del perfil del usuario a Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const googleUser = await userResponse.json();
        // googleUser contiene: email, name (nickname), sub (google_id), picture

        // 4. Buscamos si el usuario ya existe por su email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [googleUser.email]);
        let user = rows[0];

        // Subir la foto a Vercel Blob
        const uploadProfileImage = async (imageUrl, nickname) => {
            try {
                const response = await fetch(imageUrl);
                const arrayBuffer = await response.arrayBuffer();
                const contentType = response.headers.get('content-type') || 'image/jpeg';

                // Subimos el archivo a Vercel Blob
                const blob = await put(`avatars/${nickname}-${Date.now()}.jpg`, arrayBuffer, {
                    access: 'public',
                    contentType: contentType
                });
                return blob.url; // Devolvemos la URL permanente de Vercel
            } catch (error) {
                console.error("Error subiendo a Vercel Blob:", error);
                return imageUrl; // Si falla, devolvemos la original de Google como backup
            }
        };

        if (!user) {
            // 5. Si NO existe, descargamos foto, subimos a Blob y creamos usuario
            const vercelBlobUrl = await uploadProfileImage(googleUser.picture, googleUser.name);

            const [result] = await db.query(
                'INSERT INTO users (nickname, email, auth_provider, google_id, profile_image) VALUES (?, ?, ?, ?, ?)',
                [googleUser.name, googleUser.email, 'google', googleUser.sub, vercelBlobUrl]
            );

            // ACTUALIZACIÓN: Guardamos todos los datos en la variable 'user' para la sesión
            user = {
                user_id: result.insertId,
                nickname: googleUser.name,
                profile_image: vercelBlobUrl // Importante para que se vea en el Dashboard nada más registrarse
            };

            // Enviamos email de bienvenida
            try {
                // ACTUALIZACIÓN: Usamos googleUser.email y googleUser.name (antes email/nickname no existían)
                await sendWelcomeEmail(googleUser.email, googleUser.name);
                console.log(`✅ Correo de bienvenida enviado a: ${googleUser.email}`);
            } catch (mailError) {
                // Logueamos el error pero no cortamos el registro
                console.error('❌ Error enviando email:', mailError);
            }

            console.log("🆕 Nuevo usuario con foto en Vercel Blob:", googleUser.email);
        } else {
            // 6. Si ya existe, comprobamos si le falta el google_id o la imagen
            let updateFields = [];
            let queryParams = [];

            if (!user.google_id) {
                updateFields.push('google_id = ?', 'auth_provider = "google"');
                queryParams.push(googleUser.sub);
            }

            // Si no tiene imagen, la subimos ahora
            if (!user.profile_image) {
                const vercelBlobUrl = await uploadProfileImage(googleUser.picture, user.nickname);
                updateFields.push('profile_image = ?');
                queryParams.push(vercelBlobUrl);
                user.profile_image = vercelBlobUrl; // Actualizamos la variable local
            } else {
                // Si ya existe, vamos a actualizar su foto de perfil 
                // cada vez que haga login para tener la versión más reciente
                const nuevaFotoVercel = await uploadProfileImage(googleUser.picture, user.nickname);
                
                // ACTUALIZACIÓN: Guardamos la nueva foto en la variable 'user' para que el token la lleve
                user.profile_image = nuevaFotoVercel;

                await db.query(
                    'UPDATE users SET profile_image = ?, google_id = ?, auth_provider = "google" WHERE user_id = ?',
                    [nuevaFotoVercel, googleUser.sub, user.user_id]
                );

                console.log("✅ Foto de perfil actualizada desde Google");
            }

            if (updateFields.length > 0) {
                queryParams.push(user.user_id);
                await db.query(
                    `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
                    queryParams
                );
            }
            console.log("✅ Usuario actualizado con éxito");
        }

        // --- CREACIÓN DE SESIÓN (IGUAL QUE EN TU LOGIN) ---

        // 7. Generamos tu JWT usando tu función createSession
        // Nota: Asegúrate de que createSession use los mismos nombres de campo que esperas en el Sidebar
        const token = await createSession({
            userId: user.user_id,
            nickname: user.nickname,
            profileImage: user.profile_image // Verificamos que lleve la URL de Vercel Blob
        });

        // 8. Creamos la respuesta y guardamos la COOKIE
        const response = NextResponse.redirect(new URL('/dashboard', request.url));

        response.cookies.set('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 2, // 2 horas (igual que tu login manual)
            path: '/',
        });

        // 9. Limpiamos la cookie del state
        response.cookies.delete('oauth_state');

        return response;

    } catch (error) {
        console.error('Error en el callback de Google:', error);
        return NextResponse.redirect(new URL('/auth?error=auth_failed', request.url));
    }
}