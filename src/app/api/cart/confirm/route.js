import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req) {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { addressId, customerNote, codeId, totalAmount } = await req.json();

    if (!addressId) {
        return NextResponse.json({ error: 'Selecciona una dirección de envío' }, { status: 400 });
    }

    try {
        // Obtener el carrito activo
        const [orders] = await db.query(
            `SELECT order_id FROM orders 
             WHERE user_id = ? AND order_status = 'dise\u00F1ando' 
             LIMIT 1`,
            [session.userId]
        );

        if (!orders.length) {
            return NextResponse.json({ error: 'No hay carrito activo' }, { status: 404 });
        }

        const orderId = orders[0].order_id;

        // Verificar que la dirección pertenece al usuario
        const [addresses] = await db.query(
            `SELECT address_id FROM userAddresses WHERE address_id = ? AND user_id = ?`,
            [addressId, session.userId]
        );

        if (!addresses.length) {
            return NextResponse.json({ error: 'Dirección no válida' }, { status: 400 });
        }

        // Confirmar el pedido: cambiar estado y guardar datos finales
        await db.query(
            `UPDATE orders 
             SET order_status = 'pendiente de aprobaci\u00F3n',
                 address_id = ?,
                 customer_note = ?,
                 code_id = ?,
                 total_amount = ?
             WHERE order_id = ?`,
            [addressId, customerNote || null, codeId || null, totalAmount, orderId]
        );

        // Incrementar el contador de usos del código si se aplicó
        if (codeId) {
            await db.query(
                `UPDATE discount_codes SET uses_count = uses_count + 1 WHERE code_id = ?`,
                [codeId]
            );

            // Descontar hygge points si el código los requería
            const [codeRows] = await db.query(
                `SELECT hygge_points_cost FROM discount_codes WHERE code_id = ?`,
                [codeId]
            );
            if (codeRows[0]?.hygge_points_cost) {
                await db.query(
                    `UPDATE users SET hygge_points = hygge_points - ? WHERE user_id = ?`,
                    [codeRows[0].hygge_points_cost, session.userId]
                );
            }
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error('[cart/confirm]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}