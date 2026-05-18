// ENDPOINT PARA AÑADIR AL CARRITO — Guarda un producto con su talla seleccionada en la cesta del usuario.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req) {
    // Verificar sesión activa desde la cookie JWT
    const session = await getSession();

    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, sizeId, quantity, unitPrice, customSizeLabel } = await req.json();

    // Validación básica de datos recibidos
    if (!productId || !sizeId || !unitPrice || !quantity || quantity < 1) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const userId = session.userId;

    try {
        // Buscar si ya existe un pedido borrador (carrito) para este usuario
        const [existingOrders] = await db.query(
            `SELECT order_id FROM orders 
             WHERE user_id = ? AND order_status = 'en_carrito' 
             LIMIT 1`,
            [userId]
        );

        let orderId;

        if (existingOrders.length > 0) {
            // Reutilizar el carrito abierto
            orderId = existingOrders[0].order_id;
        } else {
            // Crear un nuevo pedido en estado borrador (carrito)
            const [result] = await db.query(
                `INSERT INTO orders (user_id, order_status) VALUES (?, 'en_carrito')`,
                [userId]
            );
            orderId = result.insertId;
        }

        let finalSizeId = sizeId;

        // Si es una medida personalizada nueva, la registramos en la BBDD con active = 0
        if (customSizeLabel) {
            const [existingSize] = await db.query(
                `SELECT product_size_id FROM product_sizes WHERE product_id = ? AND size = ? LIMIT 1`,
                [productId, customSizeLabel]
            );

            if (existingSize.length > 0) {
                finalSizeId = existingSize[0].product_size_id;
            } else {
                const [insertResult] = await db.query(
                    `INSERT INTO product_sizes (product_id, size, price, active) VALUES (?, ?, ?, 0)`,
                    [productId, customSizeLabel, unitPrice]
                );
                finalSizeId = insertResult.insertId;
            }
        }

        // Comprobar si ya existe esa combinación producto+talla en el carrito
        const [existingItem] = await db.query(
            `SELECT order_product_id, quantity FROM order_product 
             WHERE order_id = ? AND product_id = ? AND product_size_id = ? 
             LIMIT 1`,
            [orderId, productId, finalSizeId]
        );

        if (existingItem.length > 0) {
            // Ya existe: acumular la cantidad
            await db.query(
                `UPDATE order_product 
                 SET quantity = quantity + ? 
                 WHERE order_product_id = ?`,
                [quantity, existingItem[0].order_product_id]
            );
        } else {
            // Nueva línea en el carrito con snapshot del precio actual
            await db.query(
                `INSERT INTO order_product (order_id, product_id, product_size_id, quantity, unit_price) 
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, productId, finalSizeId, quantity, unitPrice]
            );
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error('[cart/add]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}