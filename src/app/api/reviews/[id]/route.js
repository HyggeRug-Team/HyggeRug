import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { deleteReview } from '@/lib/db/reviews';

export async function DELETE(request, { params }) {
    const { id } = await params;
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await deleteReview(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
