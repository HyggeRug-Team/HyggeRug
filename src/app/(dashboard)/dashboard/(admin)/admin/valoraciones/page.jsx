/**
 * @file admin/valoraciones/page.jsx
 * @description Gestión administrativa de reseñas de productos.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminReviewsClient from "@/components/dashboard/admin/AdminReviewsClient/AdminReviewsClient";
import { getAllReviews } from "@/lib/db/reviews";

export const metadata = {
    title: 'Gestión de Valoraciones | Admin Hygge Rug',
};

export default async function AdminReviewsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await verifySession(token);

    if (!session || session.role !== 'admin') {
        redirect("/auth");
    }

    const reviews = await getAllReviews();

    return (
        <AdminReviewsClient 
            initialReviews={reviews} 
            session={session}
        />
    );
}
