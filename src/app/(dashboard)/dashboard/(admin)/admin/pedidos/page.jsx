/**
 * @file app/(dashboard)/(admin)/pedidos/page.jsx
 * @description Server Component que obtiene todos los pedidos activos (sin en_carrito)
 *              ordenados FIFO y los pasa al componente cliente.
 *
 * [Por qué así]
 * Al ser Server Component, la consulta SQL se ejecuta en el servidor sin exponer
 * credenciales. El cliente solo recibe los datos ya formateados y listos para renderizar.
 */

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata = { title: 'Gestión de Pedidos | Admin' };

/**
 * Obtiene todos los pedidos relevantes para el admin.
 * Incluye datos del usuario y los artículos de cada pedido.
 * Ordenados de más antiguo a más reciente (FIFO).
 */
async function getAdminOrders() {
  const [rows] = await db.query(`
    SELECT
      o.order_id,
      o.order_status,
      o.total_amount,
      o.creation_date,
      o.customer_note,
      o.payment_method,
      u.nickname,
      u.email,
      u.profile_image,
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
    LEFT JOIN users u            ON o.user_id    = u.user_id
    LEFT JOIN order_product op   ON o.order_id   = op.order_id
    LEFT JOIN products p         ON op.product_id = p.product_id
    WHERE o.order_status != 'en_carrito'
    GROUP BY
      o.order_id, o.order_status, o.total_amount,
      o.creation_date, o.customer_note, o.payment_method,
      u.nickname, u.email, u.profile_image
    ORDER BY o.creation_date ASC
  `);

  // Parseamos el JSON de items y filtramos nulos (pueden aparecer si el pedido
  // no tiene artículos todavía por el LEFT JOIN)
  return rows.map(row => ({
    ...row,
    items: (
      typeof row.items === 'string'
        ? JSON.parse(row.items)
        : row.items ?? []
    ).filter(Boolean),
  }));
}

export default async function AdminPedidosPage() {
  // Protección de ruta: solo admins
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/auth');
  }

  const orders = await getAdminOrders();

  return <AdminOrdersClient initialOrders={orders} />;
}
