/**
 * @file app/api/admin/order-products/[id]/adjusted-image/route.js
 * @description Endpoint POST para subir el diseño ajustado de un artículo de pedido.
 *              Sube el archivo a Vercel Blob y guarda la URL en order_product.adjusted_image.
 *              Solo accesible por admins.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    // Verificamos que el order_product_id existe antes de subir
    const [rows] = await db.query(
      'SELECT order_product_id FROM order_product WHERE order_product_id = ?',
      [id]
    );
    if (!rows[0]) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    // Subimos la imagen a Vercel Blob
    const arrayBuffer  = await file.arrayBuffer();
    const contentType  = file.type || 'image/jpeg';
    const blob = await put(
      `adjusted-designs/order-product-${id}-${Date.now()}.jpg`,
      arrayBuffer,
      { access: 'public', contentType }
    );

    // Guardamos la URL en la columna adjusted_image
    await db.query(
      'UPDATE order_product SET adjusted_image = ? WHERE order_product_id = ?',
      [blob.url, id]
    );

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('[Admin] Error subiendo diseño ajustado:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}