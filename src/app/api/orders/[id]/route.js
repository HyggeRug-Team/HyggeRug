// ENDPOINT PARA VER EL DETALLE ESPECÍFICO DE UN PEDIDO CONCRETO
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getOrderById } from '@/lib/db/orders';

// GET -> /api/orders/[id] donde [id] es un numérico.
export async function GET(_request, { params }) {
    try {
        const session = await getSession();
        // Cierre de seguridad anti intrusos generales
        if (!session) {
            return NextResponse.json({ error: 'No tienes la sesión iniciada' }, { status: 401 });
        }

        const { id } = await params;
        const orderId = parseInt(id, 10);

        if (isNaN(orderId)) {
            return NextResponse.json({ error: 'Número de pedido erróneo en la URL' }, { status: 400 });
        }

        const order = await getOrderById(orderId);

        if (!order) {
            // Este es el mítico error 404
            return NextResponse.json({ error: 'El pedido que buscas ya no existe' }, { status: 404 });
        }

        // ===================================
        // FILTRO DE SEGURIDAD PRIVADA DE ORDEN
        // ===================================
        // O bien eres el DUEÑO que compró la alfombra, o tienes el Rango 'admin'
        // Esto impide que el User A vea el historial del User B modificando el numerito de la URL web
        const isOwner = order.user_id === session.userId;
        const isAdmin = session.role === 'admin';

        if (!isOwner && !isAdmin) {
            // Error 403 Forbidden = Tienes cuenta pero no permisos de visualización aquí
            return NextResponse.json({ error: 'Permisos insuficientes para husmear este pedido' }, { status: 403 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error(`[GET /api/orders/${params?.id}]`, error);
        return NextResponse.json(
            { error: 'Error del sistema al obtener este recibo' },
            { status: 500 }
        );
    }
}
