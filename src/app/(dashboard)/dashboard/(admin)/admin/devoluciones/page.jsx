/**
 * @file admin/devoluciones/page.jsx
 * @description Gestión administrativa de solicitudes de devolución.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminReturnsClient from "@/components/dashboard/admin/AdminReturnsClient/AdminReturnsClient";
import { getAllReturns } from "@/lib/db/returns";

export const metadata = {
    title: 'Gestión de Devoluciones | Admin Hygge Rug',
};

export default async function AdminReturnsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await verifySession(token);

    if (!session || session.role !== 'admin') {
        redirect("/auth");
    }

    const returns = await getAllReturns();

    return (
        <AdminReturnsClient 
            initialReturns={returns} 
            session={session}
        />
    );
}
