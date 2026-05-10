/**
 * @file app/api/admin/orders/[orderId]/status/route.js
 * @description Endpoint PUT para cambiar el estado de un pedido.
 *              Solo accesible por usuarios con rol 'admin'.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; 
import {db} from '@/lib/db';

// Lista de estados válidos (mismos que el ENUM de la BBDD, sin 'en_carrito')
const VALID_STATUSES = [
  'diseñando',
  'pendiente de aprobación',
  'comprobando pago',
  'tejiendo',
  'enviado',
  'recibido',
];

export async function PUT(request, { params }) {
  // Verificamos sesión y rol admin antes de hacer nada
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  // Validamos que el estado recibido sea un valor permitido
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  try {
    const [result] = await db.query(
      'UPDATE orders SET order_status = ? WHERE order_id = ? AND order_status != ?',
      [status, id, 'en_carrito'] // Protección extra: nunca tocamos carritos
    );

    // Si no se afectó ninguna fila, el pedido no existe o está en_carrito
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id, newStatus: status });
  } catch (error) {
    console.error('[Admin] Error al actualizar estado del pedido:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
