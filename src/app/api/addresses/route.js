import { getSession } from "@/lib/auth";
import { getAddressesByUser, createAddress } from "@/lib/db/addresses";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user_id || session.id;
    const addresses = await getAddressesByUser(userId);

    return NextResponse.json(addresses);
}

export async function POST(req) {
    const session = await getSession();

    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.userId;
    const body = await req.json();

    // createAddress devuelve solo el insertId
    const insertId = await createAddress(userId, body);

    // Hacemos SELECT para devolver el objeto completo al cliente
    // El cliente lo necesita para añadirlo al estado local sin recargar
    const [rows] = await db.query(
        "SELECT * FROM userAddresses WHERE address_id = ?",
        [insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
}