// ENDPOINT PARA AÑADIR AL CARRITO — Guarda un producto con su talla seleccionada en la cesta del usuario.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req) {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, sizeId, quantity, unitPrice, customSizeLabel } = await req.json();

    // Validar cantidad como entero positivo con límite razonable
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
        return NextResponse.json({ error: 'Cantidad no válida' }, { status: 400 });
    }

    if (!productId || !sizeId) {
        return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Limitar longitud de medida personalizada
    if (customSizeLabel && customSizeLabel.length > 100) {
        return NextResponse.json({ error: 'La medida personalizada es demasiado larga' }, { status: 400 });
    }

    const userId = session.userId;

    try {
        // Buscar o crear el carrito activo
        const [existingOrders] = await db.query(
            `SELECT order_id FROM orders
             WHERE user_id = ? AND order_status = 'en_carrito'
             LIMIT 1`,
            [userId]
        );

        let orderId;
        if (existingOrders.length > 0) {
            orderId = existingOrders[0].order_id;
        } else {
            const [result] = await db.query(
                `INSERT INTO orders (user_id, order_status) VALUES (?, 'en_carrito')`,
                [userId]
            );
            orderId = result.insertId;
        }

        let finalSizeId = sizeId;
        let trustedUnitPrice;

        if (customSizeLabel) {
            // Para medidas personalizadas: el precio es un estimado del cliente
            // El precio real lo fija el admin en la aprobación del pedido
            if (!unitPrice || typeof unitPrice !== 'number' || unitPrice < 0 || unitPrice > 50000) {
                return NextResponse.json({ error: 'Precio no válido' }, { status: 400 });
            }
            trustedUnitPrice = unitPrice;

            const [existingSize] = await db.query(
                `SELECT product_size_id FROM product_sizes WHERE product_id = ? AND size = ? LIMIT 1`,
                [productId, customSizeLabel]
            );

            if (existingSize.length > 0) {
                finalSizeId = existingSize[0].product_size_id;
            } else {
                const [insertResult] = await db.query(
                    `INSERT INTO product_sizes (product_id, size, price, active) VALUES (?, ?, ?, 0)`,
                    [productId, customSizeLabel, trustedUnitPrice]
                );
                finalSizeId = insertResult.insertId;
            }
        } else {
            // Para tallas estándar: obtener el precio desde la base de datos, nunca del cliente
            const [[size]] = await db.query(
                `SELECT price FROM product_sizes
                 WHERE product_size_id = ? AND product_id = ? AND active = 1`,
                [sizeId, productId]
            );
            if (!size) {
                return NextResponse.json({ error: 'Talla no disponible' }, { status: 400 });
            }
            trustedUnitPrice = size.price;
        }

        // Comprobar si ya existe esa combinación en el carrito
        const [existingItem] = await db.query(
            `SELECT order_product_id, quantity FROM order_product
             WHERE order_id = ? AND product_id = ? AND product_size_id = ?
             LIMIT 1`,
            [orderId, productId, finalSizeId]
        );

        if (existingItem.length > 0) {
            await db.query(
                `UPDATE order_product
                 SET quantity = quantity + ?
                 WHERE order_product_id = ?`,
                [quantity, existingItem[0].order_product_id]
            );
        } else {
            await db.query(
                `INSERT INTO order_product (order_id, product_id, product_size_id, quantity, unit_price)
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, productId, finalSizeId, quantity, trustedUnitPrice]
            );
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error('[cart/add]', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
