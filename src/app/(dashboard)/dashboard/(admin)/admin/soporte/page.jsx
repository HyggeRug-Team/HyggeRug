/**
 * @file page.jsx
 * @description Punto de entrada para la gestión administrativa de Soporte y Devoluciones.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este Server Component para centralizar la carga de datos de 
 * todas las incidencias abiertas. Queremos que el administrador tenga una 
 * visión clara de lo que requiere atención inmediata.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Eficiencia de Carga: Obtenemos toda la información (usuario, ticket, pedido) 
 *    en el servidor antes de hidratar el cliente, eliminando tiempos de espera.
 * 2. Seguridad Robusta: Validamos el rol de administrador antes de realizar 
 *    cualquier consulta sensible a la base de datos.
 * 3. Orden Lógico: Priorizamos en la consulta SQL los tickets que están 
 *    'abiertos' o 'en revisión' para que nunca se queden atrás.
 */

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSupportClient from '@/components/dashboard/admin/AdminSupportClient/AdminSupportClient';

export const metadata = { title: 'Tickets Soporte | Admin' };

async function getAdminTickets() {
  const [rows] = await db.query(`
    SELECT 
      t.*,
      u.nickname as user_nickname,
      u.email as user_email,
      u.profile_image as user_image,
      o.order_status,
      o.total_amount
    FROM support_tickets t
    LEFT JOIN users u ON t.user_id = u.user_id
    LEFT JOIN orders o ON t.order_id = o.order_id
    ORDER BY 
      CASE WHEN t.status IN ('abierto', 'en_revision') THEN 0 ELSE 1 END,
      t.creation_date DESC
  `);
  return rows;
}

export default async function AdminSoportePage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/auth');
  }

  const tickets = await getAdminTickets();

  return <AdminSupportClient initialTickets={tickets} session={session} />;
}
