/**
 * @file route.js
 * @description Endpoint API para la gestión de Ajustes de la Tienda (Tabla config).
 * 
 * [Nuestro enfoque]
 * Esta API es el puente directo entre el panel de administración y las variables 
 * críticas del sistema (costes de envío, banners, etc.). Hemos implementado 
 * un CRUD completo (Leer, Crear, Actualizar y Eliminar) protegido por validación 
 * de sesión para asegurar que solo los administradores puedan tocar estos datos.
 * 
 * [Por qué lo hemos hecho así]
 * Separar las operaciones en bloques try/catch independientes por método HTTP 
 * nos permite manejar errores de forma granular, como avisar al usuario si 
 * intenta crear una clave (`config_key`) que ya existe en la base de datos 
 * sin tumbar todo el servicio.
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

/* ── LECTURA: Obtener todas las configuraciones ── */
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Traemos todo el diccionario de variables, ordenado por ID para mantener la vista estable
    const [configs] = await db.query(`SELECT * FROM config ORDER BY id ASC`);
    return NextResponse.json({ configs });
  } catch (err) {
    console.error('[API /admin/config] Error GET:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

/* ── CREACIÓN: Añadir un nuevo ajuste ── */
export async function POST(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { config_key, config_value, config_description } = body;

    // La clave es el identificador único a nivel lógico, no podemos permitirla vacía
    if (!config_key) {
      return NextResponse.json({ error: 'La clave (key) es obligatoria' }, { status: 400 });
    }

    const [result] = await db.query(
      `INSERT INTO config (config_key, config_value, config_description) VALUES (?, ?, ?)`,
      [config_key, config_value || '', config_description || '']
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('[API /admin/config] Error POST:', err);
    // Si la clave ya existe (restricción UNIQUE en BD), avisamos elegantemente
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'La clave de configuración ya existe' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

/* ── ACTUALIZACIÓN: Editar un ajuste existente ── */
export async function PUT(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { id, config_key, config_value, config_description } = body;

    if (!id || !config_key) {
      return NextResponse.json({ error: 'ID y clave son obligatorios' }, { status: 400 });
    }

    // Actualizamos el registro usando su ID interno como ancla
    await db.query(
      `UPDATE config SET config_key = ?, config_value = ?, config_description = ? WHERE id = ?`,
      [config_key, config_value || '', config_description || '', id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /admin/config] Error PUT:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

/* ── ELIMINACIÓN: Borrar un ajuste ── */
export async function DELETE(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID obligatorio para eliminar' }, { status: 400 });
    }

    await db.query(`DELETE FROM config WHERE id = ?`, [id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /admin/config] Error DELETE:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
