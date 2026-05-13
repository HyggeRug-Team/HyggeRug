/**
 * @file route.js (api/products/search)
 * @description API para la búsqueda de productos filtrada por comunidad y visibilidad.
 * 
 * [Nuestro enfoque]
 * Hemos implementado una búsqueda que ignora mayúsculas y minúsculas para que sea 
 * más permisiva con el usuario. Filtramos estrictamente por productos públicos y de la comunidad.
 * 
 * [Por qué lo hemos hecho así]
 * Queremos que los resultados sean siempre relevantes y seguros, evitando mostrar
 * diseños privados o borradores en el buscador público.
 */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ products: [] });
        }

        // Buscamos productos que coincidan con el nombre o la descripción.
        // Forzamos la comparación en minúsculas para que la búsqueda sea robusta.
        const searchTerm = `%${query.toLowerCase()}%`;
        
        const [products] = await db.query(
            `SELECT product_id, name, description, image_url, base_price 
             FROM products 
             WHERE (LOWER(name) LIKE ? OR LOWER(description) LIKE ?) 
             AND public = 1 AND community = 1
             ORDER BY product_id DESC
             LIMIT 15`,
            [searchTerm, searchTerm]
        );

        return NextResponse.json({ products });
    } catch (error) {
        console.error('[API/SEARCH]', error);
        return NextResponse.json({ error: 'Error en la búsqueda' }, { status: 500 });
    }
}
