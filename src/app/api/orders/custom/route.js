/**
 * @file route.js (api/orders/custom)
 * @description API para recibir y guardar solicitudes de alfombras personalizadas.
 *
 * [Nuestro enfoque]
 * Hemos dividido el proceso en dos pasos: primero creamos el pedido principal con estado
 * "pendiente de aprobación", y luego guardamos los detalles técnicos del diseño.
 *
 * [Por qué lo hemos hecho así]
 * Este flujo nos permite revisar cada encargo antes de comprometer al taller, evitando
 * fabricar algo que luego no coincida con lo que esperaba el cliente.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
export async function POST(req) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Sesión no válida' }, { status: 401 });
        }

        const data = await req.json();
        const { title, description, size, comments, image, userId } = data;

        // Creamos el pedido principal con estado pendiente para que el taller lo revise
        const [orderResult] = await db.query(`
            INSERT INTO orders 
                (user_id, total_amount, order_status, payment_method) 
            VALUES (?, ?, ?, ?)
        `, [
            userId, 
            0, 
            'pendiente de aprobación', 
            'presupuesto'
        ]);

        const orderId = orderResult.insertId;

        // Guardamos los detalles técnicos del encargo en el campo de diseño final
        const technicalDetails = `Tamaño: ${size}\nComentarios: ${comments}\nDescripción: ${description}`;

        await db.query(`
            INSERT INTO order_product 
                (order_id, product_id, price, quantity, user_image, final_design) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            orderId, 
            1, // ID genérico para alfombra personalizada
            0, 
            1, 
            image, // Imagen de referencia
            technicalDetails // Detalles técnicos del pedido
        ]);

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        console.error('Error creating custom order:', error);
        return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
    }
}
