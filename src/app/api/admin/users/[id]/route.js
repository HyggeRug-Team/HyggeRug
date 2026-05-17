/**
 * @file api/admin/users/[id]/route.js
 * @description Endpoint para obtener todos los pedidos detallados de un usuario específico.
 *
 * [Nuestro enfoque]
 * Al seleccionar un usuario en el panel, cargamos sus pedidos completos (con artículos)
 * para mostrarlos en el panel lateral de detalles.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Datos del usuario
    const [[user]] = await db.query(
      `SELECT user_id, nickname, email, profile_image, hygge_points, creation_date, rol, active
       FROM users WHERE user_id = ?`,
      [id]
    );

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Pedidos del usuario con sus artículos
    const [rows] = await db.query(`
      SELECT
        o.order_id,
        o.order_status,
        o.total_amount,
        o.creation_date,
        o.customer_note,
        o.payment_method,
        COALESCE(
          JSON_ARRAYAGG(
            CASE WHEN op.order_product_id IS NOT NULL
            THEN JSON_OBJECT(
              'product_name', p.name,
              'image_url',    p.image_url,
              'quantity',     op.quantity,
              'unit_price',   op.unit_price
            )
            END
          ),
          JSON_ARRAY()
        ) AS items
      FROM orders o
      LEFT JOIN order_product op ON o.order_id = op.order_id
      LEFT JOIN products p       ON op.product_id = p.product_id
      WHERE o.user_id = ? AND o.order_status != 'en_carrito'
      GROUP BY
        o.order_id, o.order_status, o.total_amount,
        o.creation_date, o.customer_note, o.payment_method
      ORDER BY o.creation_date DESC
    `, [id]);

    const orders = rows.map(row => ({
      ...row,
      items: (
        typeof row.items === 'string'
          ? JSON.parse(row.items)
          : row.items ?? []
      ).filter(Boolean),
    }));

    return NextResponse.json({ user, orders });
  } catch (err) {
    console.error('[API /admin/users/[id]] Error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { active, rol } = body;

    // Evitar que el administrador se bloquee a sí mismo o se quite el rol de administrador
    if (parseInt(id) === session.userId) {
      return NextResponse.json(
        { error: 'No puedes bloquearte a ti mismo ni revocar tus propios permisos de administrador.' },
        { status: 400 }
      );
    }

    // Construimos los campos a actualizar
    const updateFields = [];
    const queryParams = [];

    if (active !== undefined) {
      updateFields.push('active = ?');
      queryParams.push(active ? 1 : 0);
    }

    if (rol !== undefined) {
      if (rol !== 'admin' && rol !== 'customer') {
        return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
      }
      updateFields.push('rol = ?');
      queryParams.push(rol);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    queryParams.push(id);
    await db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
      queryParams
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /admin/users/[id] PUT] Error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
