// ENDPOINT DE CONFIRMACIÓN DE PEDIDO — Transforma la cesta activa en un pedido real.
// El total SIEMPRE se calcula en servidor, nunca se acepta del cliente.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getConfigValue } from '@/lib/db/config';

export async function POST(req) {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // totalAmount NO se acepta del cliente
    const { addressId, customerNote, codeId } = await req.json();

    if (!addressId) {
        return NextResponse.json({ error: 'Selecciona una dirección de envío' }, { status: 400 });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Obtener carrito activo
        const [orders] = await conn.query(
            `SELECT order_id FROM orders
             WHERE user_id = ? AND order_status = 'en_carrito'
             LIMIT 1`,
            [session.userId]
        );

        if (!orders.length) {
            await conn.rollback();
            return NextResponse.json({ error: 'No hay carrito activo' }, { status: 404 });
        }

        const orderId = orders[0].order_id;

        // 2. Verificar que el carrito tiene items
        const [[{ itemCount }]] = await conn.query(
            `SELECT COUNT(*) AS itemCount FROM order_product WHERE order_id = ?`,
            [orderId]
        );

        if (itemCount === 0) {
            await conn.rollback();
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        // 3. Verificar que la dirección pertenece al usuario
        const [addresses] = await conn.query(
            `SELECT address_id FROM userAddresses WHERE address_id = ? AND user_id = ?`,
            [addressId, session.userId]
        );

        if (!addresses.length) {
            await conn.rollback();
            return NextResponse.json({ error: 'Dirección no válida' }, { status: 400 });
        }

        // 4. Calcular subtotal en servidor
        // Tallas estándar (active=1): precio oficial de product_sizes
        // Tallas personalizadas (active=0): precio estimado almacenado (el admin lo ajustará)
        const [[{ subtotal }]] = await conn.query(
            `SELECT COALESCE(SUM(op.quantity *
               CASE WHEN ps.active = 1 THEN ps.price ELSE op.unit_price END
             ), 0) AS subtotal
             FROM order_product op
             JOIN product_sizes ps ON op.product_size_id = ps.product_size_id
             WHERE op.order_id = ?`,
            [orderId]
        );

        // 5. Obtener coste de envío desde configuración
        const shippingCostRaw = await getConfigValue('shipping_cost').catch(() => '0');
        const shippingCost = parseFloat(shippingCostRaw) || 0;

        // 6. Aplicar descuento si se proporcionó código
        let discountAmount = 0;
        if (codeId) {
            // FOR UPDATE previene race conditions con usos simultáneos del mismo cupón
            const [[code]] = await conn.query(
                `SELECT code_id, discount_type, discount_value, min_order_amount,
                        max_uses, uses_count, hygge_points_cost
                 FROM discount_codes
                 WHERE code_id = ? AND is_active = 1
                 AND (valid_from IS NULL OR valid_from <= NOW())
                 AND (valid_until IS NULL OR valid_until >= NOW())
                 FOR UPDATE`,
                [codeId]
            );

            if (!code) {
                await conn.rollback();
                return NextResponse.json({ error: 'Código de descuento no válido' }, { status: 400 });
            }

            if (code.max_uses !== null && code.uses_count >= code.max_uses) {
                await conn.rollback();
                return NextResponse.json({ error: 'El código ha alcanzado su límite de usos' }, { status: 400 });
            }

            if (parseFloat(subtotal) < parseFloat(code.min_order_amount)) {
                await conn.rollback();
                return NextResponse.json({ error: 'El pedido no alcanza el mínimo para este código' }, { status: 400 });
            }

            // Verificar points del usuario si el código los requiere
            if (code.hygge_points_cost) {
                const [[userPoints]] = await conn.query(
                    `SELECT hygge_points FROM users WHERE user_id = ? FOR UPDATE`,
                    [session.userId]
                );
                if (!userPoints || userPoints.hygge_points < code.hygge_points_cost) {
                    await conn.rollback();
                    return NextResponse.json({ error: 'Hygge Points insuficientes' }, { status: 400 });
                }
                await conn.query(
                    `UPDATE users SET hygge_points = hygge_points - ? WHERE user_id = ?`,
                    [code.hygge_points_cost, session.userId]
                );
            }

            if (code.discount_type === 'percentage') {
                discountAmount = (parseFloat(subtotal) * parseFloat(code.discount_value)) / 100;
            } else {
                discountAmount = parseFloat(code.discount_value);
            }
            discountAmount = Math.min(discountAmount, parseFloat(subtotal));

            await conn.query(
                `UPDATE discount_codes SET uses_count = uses_count + 1 WHERE code_id = ?`,
                [codeId]
            );
        }

        // 7. Total calculado enteramente en servidor
        const totalAmount = Math.max(0, parseFloat(subtotal) - discountAmount + shippingCost);

        // 8. Confirmar pedido
        await conn.query(
            `UPDATE orders
             SET order_status = 'pendiente de aprobación',
                 address_id = ?,
                 customer_note = ?,
                 code_id = ?,
                 total_amount = ?,
                 creation_date = NOW()
             WHERE order_id = ?`,
            [addressId, customerNote || null, codeId || null, totalAmount, orderId]
        );

        await conn.commit();
        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        await conn.rollback();
        console.error('[cart/confirm]', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        conn.release();
    }
}
