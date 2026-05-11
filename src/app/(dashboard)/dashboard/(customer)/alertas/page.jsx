/**
 * @file alertas/page.jsx
 * @description Centro de notificaciones y alertas para el usuario.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AlertasClient from "./AlertasClient";
import styles from "./alertas.module.css";

export const metadata = {
  title: "Alertas | Hygge Rug",
  description: "Centro de notificaciones",
};

export default async function AlertasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Notificaciones</h1>
        <p>Mantente al tanto de tus pedidos y mensajes del taller.</p>
      </header>
      
      <AlertasClient />
    </div>
  );
}
