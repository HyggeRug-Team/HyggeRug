import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createReview, getAllReviews } from '@/lib/db/reviews';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const reviews = await getAllReviews();
        return NextResponse.json(reviews);
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
        const reviewId = await createReview({
            userId: session.userId,
            productId: data.productId,
            orderId: data.orderId,
            rating: data.rating,
            comment: data.comment
        });
        return NextResponse.json({ success: true, reviewId });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
