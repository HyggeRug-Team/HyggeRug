import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const [codes] = await db.query(
      `SELECT code_id, code, discount_type, discount_value, min_order_amount,
              max_uses, uses_count, valid_from, valid_until, is_active, hygge_points_cost
       FROM discount_codes
       ORDER BY code_id DESC`
    );
    return NextResponse.json({ codes });
  } catch (err) {
    console.error('[GET /admin/discount-codes]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getSession();
  if (!session || session.role !== 'admin')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const { code, discount_type, discount_value, min_order_amount, max_uses,
            valid_from, valid_until, hygge_points_cost } = await req.json();

    if (!code?.trim() || !discount_type || discount_value == null)
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });

    if (!['percentage', 'fixed'].includes(discount_type))
      return NextResponse.json({ error: 'Tipo de descuento inválido' }, { status: 400 });

    if (parseFloat(discount_value) <= 0)
      return NextResponse.json({ error: 'El valor del descuento debe ser mayor que 0' }, { status: 400 });

    const [result] = await db.query(
      `INSERT INTO discount_codes
         (code, discount_type, discount_value, min_order_amount, max_uses, valid_from, valid_until, hygge_points_cost, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        code.trim().toUpperCase(),
        discount_type,
        parseFloat(discount_value),
        parseFloat(min_order_amount) || 0,
        max_uses ? parseInt(max_uses) : null,
        valid_from || null,
        valid_until || null,
        hygge_points_cost ? parseInt(hygge_points_cost) : null,
      ]
    );

    return NextResponse.json({ success: true, code_id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return NextResponse.json({ error: 'Ya existe un código con ese nombre' }, { status: 409 });
    console.error('[POST /admin/discount-codes]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
