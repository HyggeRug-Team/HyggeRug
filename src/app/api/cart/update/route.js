// ENDPOINT PARA ACTUALIZAR EL CARRITO — Cambia la cantidad de un artículo ya existente en la cesta.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req) {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderProductId, quantity } = await req.json();

    if (!orderProductId || quantity < 1) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        // Verificar que el item pertenece al carrito del usuario antes de modificar
        const [rows] = await db.query(
            `SELECT op.order_product_id 
             FROM order_product op
             JOIN orders o ON o.order_id = op.order_id
             WHERE op.order_product_id = ? AND o.user_id = ? AND o.order_status = 'en_carrito'`,
            [orderProductId, session.userId]
        );

        if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        await db.query(
            `UPDATE order_product SET quantity = ? WHERE order_product_id = ?`,
            [quantity, orderProductId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[cart/update]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}