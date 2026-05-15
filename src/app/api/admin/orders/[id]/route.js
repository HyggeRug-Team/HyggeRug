/**
 * @file app/api/admin/orders/[id]/route.js
 * @description Endpoint para obtener el detalle completo de un pedido (GET)
 *              y para actualizarlo: cambio de estado o precio (PUT).
 *              Solo accesible por admins.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getConfigValue } from '@/lib/db/config';

const VALID_STATUSES = [
  'diseñando',
  'pendiente de aprobación',
  'comprobando pago',
  'tejiendo',
  'enviado',
  'recibido',
];

// ── Protección compartida ──────────────────────────────────────────
async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return null;
  return session;
}

/* ─────────────────────────────────────────────────────────────────
   GET — Obtiene el detalle completo del pedido para el admin.
   Incluye usuario, dirección, artículos con imágenes y tallas.
   ───────────────────────────────────────────────────────────────── */
export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;

  try {
    const [rows] = await db.query(`
      SELECT
        o.order_id,
        o.order_status,
        o.total_amount,
        o.creation_date,
        o.updated_date,
        o.customer_note,
        o.payment_method,
        o.payment_id,
        u.user_id,
        u.nickname,
        u.email,
        u.profile_image,
        ua.calle,
        ua.portal_piso_puerta,
        ua.ciudad,
        ua.provincia,
        ua.codigo_postal,
        ua.phone_number,
        dc.code           AS discount_code,
        dc.discount_type  AS discount_type,
        dc.discount_value AS discount_value,
        COALESCE(
          JSON_ARRAYAGG(
            CASE WHEN op.order_product_id IS NOT NULL
            THEN JSON_OBJECT(
              'order_product_id', op.order_product_id,
              'product_id',       op.product_id,
              'product_name',     p.name,
              'product_image',    p.image_url,
              'user_image',       op.user_image,
              'final_design',     op.final_design,
              'adjusted_image',   op.adjusted_image,
              'customer_note',    op.customer_note,
              'quantity',         op.quantity,
              'unit_price',       op.unit_price,
              'size',             ps.size,
              'community',        p.community,
              'is_public',        p.public
            )
            END
          ),
          JSON_ARRAY()
        ) AS items
      FROM orders o
      LEFT JOIN users u             ON o.user_id          = u.user_id
      LEFT JOIN userAddresses ua    ON o.address_id       = ua.address_id
      LEFT JOIN order_product op    ON o.order_id         = op.order_id
      LEFT JOIN products p          ON op.product_id      = p.product_id
      LEFT JOIN product_sizes ps    ON op.product_size_id = ps.product_size_id
      LEFT JOIN discount_codes dc   ON o.code_id          = dc.code_id
      WHERE o.order_id = ? AND o.order_status != 'en_carrito'
      GROUP BY
        o.order_id, o.order_status, o.total_amount, o.creation_date,
        o.updated_date, o.customer_note, o.payment_method, o.payment_id,
        u.user_id, u.nickname, u.email, u.profile_image,
        ua.calle, ua.portal_piso_puerta, ua.ciudad,
        ua.provincia, ua.codigo_postal, ua.phone_number,
        dc.code, dc.discount_type, dc.discount_value
    `, [id]);

    const order = rows[0];
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    // Parseamos el JSON de items y filtramos nulos del LEFT JOIN
    order.items = (
      typeof order.items === 'string' ? JSON.parse(order.items) : order.items ?? []
    ).filter(Boolean);

    return NextResponse.json({ order });
  } catch (error) {
    console.error('[Admin GET order]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/* ─────────────────────────────────────────────────────────────────
   PUT — Actualiza el pedido.
   Acepta { status } para cambiar el estado
   o { total_amount } para actualizar el precio.
   ───────────────────────────────────────────────────────────────── */
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status, total_amount } = body;

  try {
    // ── Cambio de estado ──
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
      }

      // Leer estado y total actuales antes de actualizar
      const [orderRows] = await db.query(
        'SELECT order_status, total_amount, user_id FROM orders WHERE order_id = ? AND order_status != ?',
        [id, 'en_carrito']
      );

      if (!orderRows.length) {
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
      }

      const { order_status: prevStatus, total_amount, user_id } = orderRows[0];

      const [result] = await db.query(
        'UPDATE orders SET order_status = ? WHERE order_id = ? AND order_status != ?',
        [status, id, 'en_carrito']
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
      }

      // Hygge points: N puntos por euro (configurable en tabla config) al pasar a tejiendo; se revierten al volver a comprobando pago
      const pointsPerEuro = parseFloat(await getConfigValue('hyggepoint_per_euro')) || 0;
      const points = Math.floor((parseFloat(total_amount) || 0) * pointsPerEuro);
      if (points > 0) {
        if (prevStatus === 'comprobando pago' && status === 'tejiendo') {
          await db.query(
            'UPDATE users SET hygge_points = hygge_points + ? WHERE user_id = ?',
            [points, user_id]
          );
        } else if (prevStatus === 'tejiendo' && status === 'comprobando pago') {
          await db.query(
            'UPDATE users SET hygge_points = GREATEST(0, hygge_points - ?) WHERE user_id = ?',
            [points, user_id]
          );
        }
      }

      return NextResponse.json({ success: true, updated: 'status', newStatus: status });
    }

    // ── Actualización de precio ──
    if (total_amount !== undefined) {
      const parsed = parseFloat(total_amount);

      if (isNaN(parsed) || parsed < 0) {
        return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
      }

      const [result] = await db.query(
        'UPDATE orders SET total_amount = ? WHERE order_id = ? AND order_status != ?',
        [parsed, id, 'en_carrito']
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
      }

      return NextResponse.json({ success: true, updated: 'price', newAmount: parsed });
    }

    return NextResponse.json({ error: 'No se proporcionó ningún campo a actualizar' }, { status: 400 });

  } catch (error) {
    console.error('[Admin PUT order]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}