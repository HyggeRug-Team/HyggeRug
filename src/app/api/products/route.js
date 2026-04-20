// ENDPOINT: OBTENEDOR DE PRODUCTOS BASE
// Se expone en http://tu-web.com/api/products para todo el catálogo global
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db/products';

// EL GET de NextJS equivaldría a router.get('/products') en un backend con Express JS clásico
export async function GET() {
    try {
        // Ejecutamos la promesa para extraerlo de BBDD
        const products = await getProducts();
        
        // Retornamos de forma exitosa siempre envuelto en JSON
        return NextResponse.json({ products });
    } catch (error) {
        console.error('[GET /api/products]', error);
        
        // El status 500 es crítico -> El server falló internamente
        return NextResponse.json(
            { error: 'Error al obtener los productos' },
            { status: 500 }
        );
    }
}
