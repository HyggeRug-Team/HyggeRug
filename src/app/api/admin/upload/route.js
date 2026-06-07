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

    const ALLOWED_FOLDERS = ['assets', 'products', 'videos', 'avatars', 'config'];
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'];

    const formData = await req.formData();
    const file = formData.get('file');
    const folderRaw = formData.get('folder') || 'assets';
    const folder = ALLOWED_FOLDERS.includes(folderRaw) ? folderRaw : 'assets';

    if (!file) {
      return NextResponse.json({ error: 'No se ha enviado ningún archivo' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
    }

    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'El archivo supera el límite de 20MB' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${folder}/${Date.now()}_${safeName}`;

    const blob = await put(fileName, file, { access: 'public' });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('[API/ADMIN/UPLOAD] Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
