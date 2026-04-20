// ENDPOINT: OBTENEDOR DE PRODUCTO INDIVIDUAL (ID DINÁMICO)
import { NextResponse } from 'next/server';
import { getProductWithSizes } from '@/lib/db/products';

// [id] entre corchetes significa que en la URl puedes consultar /api/products/1, /api/products/89 y entrará a esta función pasándole el valor como un parámetro
export async function GET(_request, { params }) {
    // Sacamos de la url el numero y lo "parseamos" (lo forzamos a ser número matemático entero Base 10)
    const { id } = await params;
    const productId = parseInt(id, 10);

    // ¿Es inválido? (NaN = Not A Number). Atajamos posibles fallos o inyecciones.
    if (isNaN(productId)) {
        return NextResponse.json({ error: 'ID de producto inválido' }, { status: 400 });
    }

    try {
        // Pedimos los datos al backend (lib/db/products)
        const product = await getProductWithSizes(productId);

        // Si existe el número pero no hay producto, error 404 clásico no encontrado
        if (!product) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }
        
        return NextResponse.json({ product });
    } catch (error) {
        console.error(`[GET /api/products/${productId}]`, error);
        return NextResponse.json(
            { error: 'Error al obtener el producto' },
            { status: 500 }
        );
    }
}
