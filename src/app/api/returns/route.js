// ENDPOINT DE DEVOLUCIONES — Gestiona la creación, consulta y actualización de estado de solicitudes de devolución.
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createReturn, getAllReturns, updateReturnStatus } from '@/lib/db/returns';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const returns = await getAllReturns();
        return NextResponse.json(returns);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const returnId = await createReturn({
            userId: session.userId,
            orderId: data.orderId,
            reason: data.reason
        });
        return NextResponse.json({ success: true, returnId });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        await updateReturnStatus(data.returnId, data.status);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
