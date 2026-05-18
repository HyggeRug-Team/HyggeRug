// ENDPOINT DE LISTA DE DESEOS — Consulta, añade y elimina productos guardados del usuario.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/lib/db/wishlist';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const items = await getWishlist(session.userId);
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { productId, action } = await request.json();

    try {
        if (action === 'add') {
            await addToWishlist(session.userId, productId);
            return NextResponse.json({ success: true, message: 'Añadido a favoritos' });
        } else if (action === 'remove') {
            await removeFromWishlist(session.userId, productId);
            return NextResponse.json({ success: true, message: 'Eliminado de favoritos' });
        }
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
