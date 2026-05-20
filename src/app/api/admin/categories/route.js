import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const [rows] = await db.query('SELECT category_id, name FROM categories ORDER BY name');
    return NextResponse.json({ categories: rows });
  } catch (err) {
    console.error('[API /admin/categories GET]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    const [result] = await db.query('INSERT INTO `categories` (`name`) VALUES (?)', [name.trim()]);
    return NextResponse.json({ success: true, category_id: result.insertId, name: name.trim() });
  } catch (err) {
    console.error('[API /admin/categories POST]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
