// ENDPOINT PARA GUARDAR DISEÑOS DEL LABORATORIO — Sube la imagen a Vercel Blob y la registra en la base de datos.
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req) {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageBase64, mimeType, width, height } = await req.json();

    if (!imageBase64 || !mimeType || !width || !height) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        // Leer precio y límites desde la tabla config
        const [configRows] = await db.query(
            `SELECT config_key, config_value FROM config 
             WHERE config_key IN ('price_per_cm2', 'max_rug_width', 'max_rug_height')`
        );
        const config = configRows.reduce((acc, row) => {
            acc[row.config_key] = parseFloat(row.config_value);
            return acc;
        }, {});

        const pricePerCm2 = config.price_per_cm2 ?? 0.0333;
        const maxWidth    = config.max_rug_width  ?? 140;
        const maxHeight   = config.max_rug_height ?? 140;

        // Validar límites máximos
        if (width > maxWidth || height > maxHeight) {
            return NextResponse.json(
                { error: `Las dimensiones no pueden superar ${maxWidth}x${maxHeight} cm` },
                { status: 400 }
            );
        }

        const price     = Math.round(width * height * pricePerCm2 * 100) / 100;
        const sizeLabel = `${width} x ${height} cm`;

        // 1. Subir imagen a Vercel Blob
        const buffer    = Buffer.from(imageBase64, 'base64');
        const extension = mimeType.split('/')[1] ?? 'png';
        const filename  = `designs/custom-${session.userId}-${Date.now()}.${extension}`;

        const blob = await put(filename, buffer, {
            access: 'public',
            contentType: mimeType,
        });

        // 2. Crear el producto personalizado
        const [productResult] = await db.query(
            `INSERT INTO products (name, description, image_url, base_price, category_id, community, public)
             VALUES ('Dise\u00F1o personalizado pendiente', 'Dise\u00F1o personalizado generado por IA', ?, ?, 1, 0, 0)`,
            [blob.url, price]
        );
        const productId = productResult.insertId;

        // 3. Crear el tamaño en product_sizes
        const [sizeResult] = await db.query(
            `INSERT INTO product_sizes (product_id, size, price, active) VALUES (?, ?, ?, 0)`,
            [productId, sizeLabel, price]
        );
        const productSizeId = sizeResult.insertId;

        // 4. Buscar o crear carrito activo
        const [existingOrders] = await db.query(
            `SELECT order_id FROM orders 
             WHERE user_id = ? AND order_status = 'en_carrito' 
             LIMIT 1`,
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

        // 5. Añadir al carrito (guardando también la imagen en final_design)
        await db.query(
            `INSERT INTO order_product (order_id, product_id, product_size_id, quantity, unit_price, final_design)
             VALUES (?, ?, ?, 1, ?, ?)`,
            [orderId, productId, productSizeId, price, blob.url]
        );

        return NextResponse.json({ success: true, productId, orderId, price, sizeLabel });

    } catch (error) {
        console.error('[studio/save]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}