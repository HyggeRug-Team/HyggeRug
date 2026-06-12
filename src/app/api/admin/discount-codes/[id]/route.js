import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// PATCH — activar / desactivar
export async function PATCH(req, { params }) {
  const session = await getSession();
  if (!session || session.role !== 'admin')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const { is_active } = await req.json();

  try {
    const [result] = await db.query(
      'UPDATE discount_codes SET is_active = ? WHERE code_id = ?',
      [is_active ? 1 : 0, id]
    );
    if (result.affectedRows === 0)
      return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /admin/discount-codes/:id]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE — eliminar (solo si uses_count === 0 para no romper histórico de pedidos)
export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session || session.role !== 'admin')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;

  try {
    const [[code]] = await db.query(
      'SELECT uses_count FROM discount_codes WHERE code_id = ?', [id]
    );
    if (!code)
      return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });

    if (code.uses_count > 0)
      return NextResponse.json(
        { error: 'No se puede eliminar un código que ya ha sido usado. Desactívalo en su lugar.' },
        { status: 409 }
      );

    await db.query('DELETE FROM discount_codes WHERE code_id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /admin/discount-codes/:id]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
