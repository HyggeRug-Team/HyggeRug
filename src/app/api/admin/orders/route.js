// ENDPOINT MAESTRO: PANEL ADMIN -> VER TODOS LOS PEDIDOS SIN EXCEPCIÓN
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/orders
export async function GET(request) {
    try {
        // Validación absoluta: TIENE que ser sí o sí un 'admin' (rango mayor en tu JWT)
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Acceso Denegado. Solo Administradores' }, { status: 401 });
        }

        // Sacamos parametros extrae como /api/admin/orders?status=diseñando
        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status');

        // Construímos un STRING (Texto) con Sentencias SQL gigante para el panel Admin
        // Aquí no guardamos la dirección para no saturar internet, el admin puede pedirla haciendo un Click dentro de la app (eso activaría la ruta [id])
        let query = `
            SELECT
                o.order_id,
                o.order_status,
                o.total_amount,
                o.discount_amount,
                o.payment_method,
                o.creation_date,
                o.updated_date,
                u.nickname,
                u.email,
                oi.product_size,
                oi.user_image,
                oi.final_design,
                oi.quantity
            FROM orders o
            LEFT JOIN users          u  ON u.user_id    = o.user_id
            LEFT JOIN orders_items   oi ON oi.order_id  = o.order_id
        `;
        const queryParams = [];

        // MAGIA de la query: Si nos pasaron un filtro lo pegamos al final del string ANTES de ejecutarlo!
        if (statusFilter) {
            query += ` WHERE o.order_status = ?`;
            queryParams.push(statusFilter);
        }

        query += ` ORDER BY o.creation_date DESC`; // Lo más reciente, arriba del todo siempre

        const [rows] = await db.query(query, queryParams);
        return NextResponse.json({ orders: rows });
    } catch (error) {
        console.error('[GET /api/admin/orders]', error);
        return NextResponse.json(
            { error: 'Error del gestor administrador al obtener todos los pedidos' },
            { status: 500 }
        );
    }
}
