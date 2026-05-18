// ENDPOINT DE ADMINISTRACIÓN — Lista todos los diseños del catálogo y permite crear nuevos productos.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminProducts, createProduct } from '@/lib/db/products';
import { getCategories } from '@/lib/db/products';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const [products, categories] = await Promise.all([getAdminProducts(), getCategories()]);
    return NextResponse.json({ products, categories });
  } catch (err) {
    console.error('[API /admin/products GET]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, image_url, base_price, category_id, isPublic, community } = body;

    if (!name || base_price === undefined) {
      return NextResponse.json({ error: 'Nombre y precio base son obligatorios' }, { status: 400 });
    }

    const productId = await createProduct({ name, description, image_url, base_price, category_id, isPublic, community });
    return NextResponse.json({ success: true, productId });
  } catch (err) {
    console.error('[API /admin/products POST]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
