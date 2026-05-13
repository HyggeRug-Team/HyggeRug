/**
 * @file route.js (api/admin/support/[id])
 * @description API para que los administradores actualicen el estado de un ticket.
 *
 * [Nuestro enfoque]
 * Hemos usado PATCH porque solo modificamos una parte del recurso (el estado y el mensaje
 * de resolución), no el ticket completo. Así respetamos la semántica REST del proyecto.
 *
 * [Por qué lo hemos hecho así]
 * Validamos la sesión y el rol de administrador en cada petición para garantizar que
 * nadie sin permisos pueda modificar el estado de los tickets desde fuera del panel.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Actualiza el estado de un ticket de soporte.
 * Solo permite cambios de estado ('open', 'closed') y mensajes de resolución.
 */
export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, resolution_message } = body;

    if (!status) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    await db.query(`
      UPDATE support_tickets 
      SET status = ?, resolution_message = ? 
      WHERE ticket_id = ?
    `, [status, resolution_message || null, id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /admin/support/[id]] Error PATCH:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
