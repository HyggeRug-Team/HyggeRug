// ENDPOINT DE ADMINISTRACIÓN — Añade una nueva talla con su precio a un producto del catálogo.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { addProductSize } from '@/lib/db/products';

export async function POST(req, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { id } = await params;
    const { size, price } = await req.json();
    if (!size || price === undefined) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios' }, { status: 400 });
    }
    const sizeId = await addProductSize(Number(id), { size, price });
    return NextResponse.json({ success: true, sizeId });
  } catch (err) {
    console.error('[API /admin/products/[id]/sizes POST]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
