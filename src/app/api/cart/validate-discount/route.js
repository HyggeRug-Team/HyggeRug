import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req) {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    try {
        const [rows] = await db.query(
            `SELECT * FROM discount_codes 
             WHERE code = ? AND is_active = 1
             AND (valid_from IS NULL OR valid_from <= NOW())
             AND (valid_until IS NULL OR valid_until >= NOW())`,
            [code]
        );

        if (!rows.length) {
            return NextResponse.json({ error: 'Código no válido o expirado' }, { status: 404 });
        }

        const discount = rows[0];

        // Comprobar límite de usos
        if (discount.max_uses !== null && discount.uses_count >= discount.max_uses) {
            return NextResponse.json({ error: 'Este código ha alcanzado su límite de usos' }, { status: 400 });
        }

        // Comprobar pedido mínimo
        if (subtotal < parseFloat(discount.min_order_amount)) {
            return NextResponse.json({
                error: `Pedido mínimo de ${parseFloat(discount.min_order_amount).toFixed(2)}€ para este código`
            }, { status: 400 });
        }

        // Comprobar si requiere hygge points
        if (discount.hygge_points_cost) {
            const [userRows] = await db.query(
                `SELECT hygge_points FROM users WHERE user_id = ?`,
                [session.userId]
            );
            if (!userRows.length || userRows[0].hygge_points < discount.hygge_points_cost) {
                return NextResponse.json({
                    error: `Necesitas ${discount.hygge_points_cost} Hygge Points para este código`
                }, { status: 400 });
            }
        }

        // Calcular el valor del descuento
        let discountAmount = 0;
        if (discount.discount_type === 'percentage') {
            discountAmount = (subtotal * parseFloat(discount.discount_value)) / 100;
        } else {
            discountAmount = parseFloat(discount.discount_value);
        }

        return NextResponse.json({
            valid: true,
            code_id: discount.code_id,
            discount_type: discount.discount_type,
            discount_value: parseFloat(discount.discount_value),
            discount_amount: Math.min(discountAmount, subtotal), // no puede superar el subtotal
            hygge_points_cost: discount.hygge_points_cost,
        });

    } catch (error) {
        console.error('[validate-discount]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}