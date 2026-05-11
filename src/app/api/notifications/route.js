/**
 * @file api/notifications/route.js
 * @description Gestión de notificaciones para el usuario.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Obtener notificaciones del usuario actual
export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const userId = session.userId;

    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY creation_date DESC LIMIT 50',
      [userId]
    );

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error('[API Notifications] GET Error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PATCH: Marcar como leídas
export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { notification_id, all } = await request.json();
    const userId = session.userId;

    if (all) {
      await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    } else {
      await db.query('UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?', [notification_id, userId]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API Notifications] PATCH Error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
