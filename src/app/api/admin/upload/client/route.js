/**
 * @file route.js (api/admin/upload/client)
 * @description Generador de tokens temporales para subidas directas desde el navegador a Vercel Blob.
 * Esto permite subir archivos grandes (>4.5MB) saltándose los límites del servidor.
 */
import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // --- SEGURIDAD: Solo administradores pueden generar este token ---
        const session = await getSession();
        if (!session || session.role !== 'admin') {
          throw new Error('No autorizado para subir archivos de sistema');
        }

        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          tokenPayload: JSON.stringify({
            adminId: session.userId,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Aquí podrías guardar el log en la base de datos si quisieras
        console.log('✅ Subida completada en Vercel Blob:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error).message },
      { status: 400 },
    );
  }
}
