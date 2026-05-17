/**
 * @file route.js (api/orders/custom)
 * @description API para recibir solicitudes de alfombras personalizadas y añadirlas al carrito.
 */
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req) {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ success: false, error: 'Sesión no válida' }, { status: 401 });
    }

    const form = await req.formData();
    const title       = form.get('title')?.trim();
    const description = form.get('description')?.trim();
    const size        = form.get('size')?.trim();
    const comments    = form.get('comments')?.trim() || null;
    const imageFile   = form.get('image');

    if (!title || !description || !size) {
        return NextResponse.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    try {
        // Subir imagen a Vercel Blob si se ha proporcionado
        let imageUrl = null;
        if (imageFile && imageFile.size > 0) {
            const ext = imageFile.name.split('.').pop() ?? 'jpg';
            const blob = await put(
                `personalizar/${session.userId}-${Date.now()}.${ext}`,
                imageFile,
                { access: 'public' }
            );
            imageUrl = blob.url;
        }

        // Crear un producto específico para este encargo personalizado
        const [productResult] = await db.query(
            `INSERT INTO products (name, description, image_url, base_price, community, public) VALUES (?, ?, ?, 0, 0, 0)`,
            [title, description, imageUrl]
        );
        const productId = productResult.insertId;

        // Crear la talla asociada al producto
        const [sizeResult] = await db.query(
            `INSERT INTO product_sizes (product_id, size, price, active) VALUES (?, ?, 0, 1)`,
            [productId, size]
        );
        const sizeId = sizeResult.insertId;

        // Buscar el carrito activo del usuario o crear uno nuevo
        const [existingOrders] = await db.query(
            `SELECT order_id FROM orders WHERE user_id = ? AND order_status = 'en_carrito' LIMIT 1`,
            [session.userId]
        );

        let orderId;
        if (existingOrders.length > 0) {
            orderId = existingOrders[0].order_id;
        } else {
            const [orderResult] = await db.query(
                `INSERT INTO orders (user_id, order_status) VALUES (?, 'en_carrito')`,
                [session.userId]
            );
            orderId = orderResult.insertId;
        }

        // Añadir el producto al carrito
        await db.query(
            `INSERT INTO order_product (order_id, product_id, product_size_id, quantity, unit_price, user_image, customer_note)
             VALUES (?, ?, ?, 1, 0, ?, ?)`,
            [orderId, productId, sizeId, imageUrl, comments]
        );

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        console.error('[orders/custom]', error);
        return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
    }
}
