/**
 * @file route.js (api/admin/upload)
 * @description API para subir archivos a Vercel Blob (uso administrativo).
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'assets';

    if (!file) {
      return NextResponse.json({ error: 'No se ha enviado ningún archivo' }, { status: 400 });
    }

    // Comprobación manual de tamaño (20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'El video es demasiado pesado (Máximo 20MB)' }, { status: 400 });
    }

    // Nombre de archivo limpio
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // Subida a Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('[API/ADMIN/UPLOAD] Error:', error);
    return NextResponse.json({ error: 'Error en la subida: ' + error.message }, { status: 500 });
  }
}
