/**
 * @file devoluciones/page.jsx
 * @description Centro de atención para solicitudes de devolución con diseño premium.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getReturnsByUser } from "@/lib/db/returns";
import DevolucionesClient from "./DevolucionesClient";

export default async function DevolucionesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const userId = session.userId || session.user_id || session.id;
  let returns = [];

  try {
      returns = await getReturnsByUser(userId);
  } catch (err) {
      console.error("Error cargando devoluciones:", err);
  }

  return <DevolucionesClient returns={returns} session={session} />;
}
