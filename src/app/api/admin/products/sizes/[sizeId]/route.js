// ENDPOINT DE ADMINISTRACIÓN — Edita los datos de una talla o la activa/desactiva del catálogo.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateProductSize, toggleProductSizeActive } from '@/lib/db/products';

export async function PUT(req, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { sizeId } = await params;
    const { size, price } = await req.json();
    if (!size || price === undefined) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios' }, { status: 400 });
    }
    await updateProductSize(Number(sizeId), { size, price });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /admin/products/sizes/[sizeId] PUT]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { sizeId } = await params;
    await toggleProductSizeActive(Number(sizeId));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /admin/products/sizes/[sizeId] PATCH]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
