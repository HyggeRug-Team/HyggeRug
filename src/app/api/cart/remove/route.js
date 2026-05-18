// ENDPOINT PARA ELIMINAR DEL CARRITO — Borra un artículo concreto de la cesta del usuario.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(req) {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderProductId } = await req.json();

    if (!orderProductId) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    try {
        // Verificar que el item pertenece al usuario antes de borrar
        const [rows] = await db.query(
            `SELECT op.order_product_id 
             FROM order_product op
             JOIN orders o ON o.order_id = op.order_id
             WHERE op.order_product_id = ? AND o.user_id = ? AND o.order_status = 'en_carrito'`,
            [orderProductId, session.userId]
        );

        if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        await db.query(
            `DELETE FROM order_product WHERE order_product_id = ?`,
            [orderProductId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[cart/remove]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}