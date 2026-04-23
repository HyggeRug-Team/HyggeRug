import { getSession } from "@/lib/auth";
import { deleteAddress, setDefaultAddress } from "@/lib/db/addresses";
import { NextResponse } from "next/server";

// DELETE /api/addresses/:id
// Elimina una dirección verificando que pertenece al usuario (evita IDOR)
export async function DELETE(_req, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.userId;
  await deleteAddress(userId, Number(id));

  return NextResponse.json({ success: true });
}

// PATCH /api/addresses/:id
// Marca una dirección como predeterminada (resetea las demás del usuario en DB)
// ✅ Correcto — await params antes de leer id
export async function PATCH(_req, { params }) {
  const { id } = await params;
  
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.userId;
  await setDefaultAddress(userId, Number(id));

  return NextResponse.json({ success: true });
}