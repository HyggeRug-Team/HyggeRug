/**
 * @file api/orders/[id]/messages/route.js
 * @description Endpoint para gestionar los mensajes de chat de un pedido con LOGS de depuración.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Obtener todos los mensajes de un pedido
export async function GET(request, { params }) {
  try {
    const session = await getSession();
    const { id } = await params;
    
    console.log(`[GET Chat] Pedido: ${id}, Usuario: ${session?.userId}, Rol: ${session?.role}`);

    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    // Verificar que el usuario tenga acceso al pedido (o sea admin)
    const [orders] = await db.query('SELECT user_id FROM orders WHERE order_id = ?', [id]);
    const order = orders[0];
    
    if (!order) {
      console.error(`[GET Chat] Pedido ${id} no encontrado`);
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Comparar IDs asegurando tipo
    const isOwner = Number(order.user_id) === Number(session.userId);
    const isAdmin = session.role === 'admin';

    if (!isAdmin && !isOwner) {
      console.error(`[GET Chat] Acceso denegado: Usuario ${session.userId} != Dueño ${order.user_id}`);
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const [messages] = await db.query(
      'SELECT * FROM order_messages WHERE order_id = ? ORDER BY creation_date ASC',
      [id]
    );

    return NextResponse.json({ messages });
  } catch (err) {
    console.error('[API /api/orders/[id]/messages] GET Error:', err);
    return NextResponse.json({ error: 'Error interno', details: err.message }, { status: 500 });
  }
}

// POST: Enviar un nuevo mensaje
export async function POST(request, { params }) {
  try {
    const session = await getSession();
    const { id } = await params;
    const body = await request.json();
    const { message } = body;

    console.log(`[POST Chat] Pedido: ${id}, Msg: "${message?.substring(0, 20)}...", Usuario: ${session?.userId}`);

    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
    }

    // Verificar acceso al pedido
    const [orders] = await db.query('SELECT user_id FROM orders WHERE order_id = ?', [id]);
    const order = orders[0];

    if (!order) {
      console.error(`[POST Chat] Pedido ${id} no encontrado`);
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Comparar IDs asegurando tipo
    const isOwner = Number(order.user_id) === Number(session.userId);
    const isAdmin = session.role === 'admin';

    if (!isAdmin && !isOwner) {
      console.error(`[POST Chat] Acceso denegado: Usuario ${session.userId} != Dueño ${order.user_id}`);
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const senderRole = isAdmin ? 'admin' : 'customer';

    await db.query(
      'INSERT INTO order_messages (order_id, sender_role, message) VALUES (?, ?, ?)',
      [id, senderRole, message]
    );

    // Si el administrador envía el mensaje, crear una notificación para el usuario
    if (isAdmin) {
      await db.query(
        `INSERT INTO notifications (user_id, type, title, message, link) 
         VALUES (?, 'chat', ?, ?, ?)`,
        [
          order.user_id,
          `Nuevo mensaje en Pedido #${id}`,
          message.length > 50 ? message.substring(0, 47) + '...' : message,
          `/dashboard/pedidos/${id}?chat=true`
        ]
      );
      console.log(`[POST Chat] Notificación creada para usuario ${order.user_id}`);
    }

    console.log(`[POST Chat] Mensaje guardado para pedido ${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/orders/[id]/messages] POST Error:', err);
    return NextResponse.json({ error: 'Error interno', details: err.message }, { status: 500 });
  }
}
