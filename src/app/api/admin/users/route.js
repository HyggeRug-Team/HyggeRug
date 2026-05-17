/**
 * @file api/admin/users/route.js
 * @description Endpoint para obtener todos los usuarios con sus pedidos asociados.
 *
 * [Nuestro enfoque]
 * Solo accesible por administradores. Devuelve la lista completa de usuarios
 * con métricas agregadas (total pedidos, gasto total) y los datos de cada pedido.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtenemos todos los usuarios con sus estadísticas de pedidos
    const [users] = await db.query(`
      SELECT
        u.user_id,
        u.nickname,
        u.email,
        u.profile_image,
        u.hygge_points,
        u.creation_date,
        u.rol,
        u.active,
        COUNT(DISTINCT o.order_id)              AS total_orders,
        COALESCE(SUM(o.total_amount), 0)        AS total_spent,
        MAX(o.creation_date)                     AS last_order_date,
        GROUP_CONCAT(DISTINCT o.order_status)    AS order_statuses
      FROM users u
      LEFT JOIN orders o
        ON o.user_id = u.user_id
        AND o.order_status != 'en_carrito'
      GROUP BY
        u.user_id, u.nickname, u.email,
        u.profile_image, u.hygge_points,
        u.creation_date, u.rol, u.active
      ORDER BY u.creation_date DESC
    `);

    return NextResponse.json({ users });
  } catch (err) {
    console.error('[API /admin/users] Error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
