/**
 * @file app/(dashboard)/dashboard/(admin)/admin/pedidos/[id]/page.jsx
 * @description Server Component que obtiene el detalle completo de un pedido
 *              y lo pasa al componente cliente para su visualización y edición.
 */

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import AdminOrderDetailClient from '@/components/dashboard/admin/AdminOrderDetailClient/AdminOrderDetailClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Pedido #${id} | Admin` };
}

async function getOrderDetail(id) {
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
            'customer_note',    op.customer_note,
            'quantity',         op.quantity,
            'unit_price',       op.unit_price,
            'size',             ps.size
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
    WHERE o.order_id = ? AND o.order_status != 'en_carrito'
    GROUP BY
      o.order_id, o.order_status, o.total_amount, o.creation_date,
      o.updated_date, o.customer_note, o.payment_method, o.payment_id,
      u.user_id, u.nickname, u.email, u.profile_image,
      ua.calle, ua.portal_piso_puerta, ua.ciudad,
      ua.provincia, ua.codigo_postal, ua.phone_number
  `, [id]);

  const order = rows[0];
  if (!order) return null;

  order.items = (
    typeof order.items === 'string' ? JSON.parse(order.items) : order.items ?? []
  ).filter(Boolean);

  return order;
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');

  const order = await getOrderDetail(id);
  if (!order) notFound();

  return <AdminOrderDetailClient order={order} />;
}
