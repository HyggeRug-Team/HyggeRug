// ENDPOINT EXCLUSIVO ADMIN: GESTIÓN DE ORDEN ESPECÍFICA (MODIFICARLA O LEERLA)
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getOrderById, updateOrderStatus } from '@/lib/db/orders';

// PATCH es como un POST pero enfocado a "Actualizar un solo fragmento", ideal para cambiar un Estado (status)
// BODY: { "status": "enviado" }
export async function PATCH(request, { params }) {
    try {
        const session = await getSession();
        // Firewall de Rango - Admin Check
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Rango no autorizado.' }, { status: 401 });
        }

        const { id } = await params;
        const orderId = parseInt(id, 10);

        if (isNaN(orderId)) {
            return NextResponse.json({ error: 'ID de pedido inválido en URL' }, { status: 400 });
        }

        // Leer los datos pasados por el administrador
        const body = await request.json();
        const { status } = body;

        // Comprobación de que no envió un JSON vacío para jorobar
        if (!status) {
            return NextResponse.json({ error: 'Debes indicar un "status" de pedido' }, { status: 400 });
        }

        // Antes de guardarlo a ciegas: verificar en sistema si ese pedido existe
        const order = await getOrderById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Oops. Este pedido del panel no existe realmente.' }, { status: 404 });
        }

        // Acción en BD!
        await updateOrderStatus(orderId, status);

        return NextResponse.json({ success: true, orderId, status });
    } catch (error) {
        console.error(`[PATCH /api/admin/orders/${params?.id}]`, error);
        
        // updateOrderStatus de lib/db/orders.js lanzara un "Error de validacion" especifico
        // lo pillamos gracias a si el mensaje incluye esa palabra
        if (error.message.includes('no válido')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Error interno o de servidor actualizando estado final' },
            { status: 500 }
        );
    }
}

// GET para consultar a fondo todo por parte del Admin
export async function GET(_request, { params }) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Privilegios Insuficientes (No ADMIN).' }, { status: 401 });
        }

        const { id } = await params;
        const orderId = parseInt(id, 10);

        if (isNaN(orderId)) {
            return NextResponse.json({ error: 'ID erróneo' }, { status: 400 });
        }

        const order = await getOrderById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'El pedido ha desaparecido de la faz BBDD' }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error(`[GET /api/admin/orders/${params?.id}]`, error);
        return NextResponse.json(
            { error: 'Sistema temporalmente down' },
            { status: 500 }
        );
    }
}
