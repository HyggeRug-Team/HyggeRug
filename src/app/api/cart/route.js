// ENDPOINT DEL CARRITO — Devuelve el contenido actual de la cesta con todos sus productos y cantidades.
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Obtener todos los items del carrito activo del usuario
        const [items] = await db.query(
            `SELECT 
                op.order_product_id,
                op.quantity,
                op.unit_price,
                p.product_id,
                p.name,
                p.description,
                p.image_url,
                op.user_image,
                op.final_design,
                s.size AS size_label
            FROM orders o
            JOIN order_product op ON op.order_id = o.order_id
            JOIN products p ON p.product_id = op.product_id
            LEFT JOIN product_sizes s ON s.product_size_id = op.product_size_id
            WHERE o.user_id = ? AND o.order_status = 'en_carrito'
            AND o.order_id = (
                SELECT order_id FROM orders 
                WHERE user_id = ? AND order_status = 'en_carrito'
                LIMIT 1
            )`,
            [session.userId, session.userId]
        );
        return NextResponse.json({ items });

    } catch (error) {
        console.error('[cart/get]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}