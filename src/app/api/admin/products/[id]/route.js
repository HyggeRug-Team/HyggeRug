import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminProductById, updateProduct, deleteProduct } from '@/lib/db/products';

export async function GET(req, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { id } = await params;
    const product = await getAdminProductById(Number(id));
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error('[API /admin/products/[id] GET]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    await updateProduct(Number(id), body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /admin/products/[id] PUT]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { id } = await params;
    await deleteProduct(Number(id));
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err.code === 'PRODUCT_IN_USE') {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error('[API /admin/products/[id] DELETE]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
