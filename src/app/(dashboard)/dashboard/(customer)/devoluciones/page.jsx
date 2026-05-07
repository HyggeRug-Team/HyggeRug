/**
 * @file devoluciones/page.jsx
 * @description Centro de atención para solicitudes de devolución y post-venta.
 * 
 * [Nuestro enfoque]
 * Proporcionamos un canal directo y transparente para que el usuario rastree sus 
 * devoluciones, integrando avisos sobre el periodo de garantía.
 * 
 * [Por qué lo hemos hecho así]
 * Una política de devoluciones visible y fácil de gestionar genera confianza, 
 * un factor crítico en la venta de productos personalizados y hechos a mano.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getReturnsByUser } from "@/lib/db/returns";
import styles from "./devoluciones.module.css";
import React from 'react';
import Link from "next/link";
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import { 
  FaArrowRotateLeft, 
  FaClock, 
  FaTriangleExclamation,
  FaCircleInfo
} from "react-icons/fa6";

export default async function DevolucionesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const userId = session.user_id || session.id;
  let returns = [];

  try {
      returns = await getReturnsByUser(userId);
  } catch (err) {
      console.error("Error cargando devoluciones:", err);
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* ========== HEADER ========== */}
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
            <h1>Tus Devoluciones</h1>
            <p>Gestiona y rastrea el estado de tus solicitudes de retorno.</p>
        </div>
        
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <main className={styles.mainContentGrid}>
        <div className={styles.infoBox}>
            <FaCircleInfo className={styles.infoIcon} />
            <p>Recuerda que tienes **14 días naturales** desde la recepción de tu alfombra para solicitar una devolución si el producto presenta algún desperfecto técnico.</p>
        </div>

        <div className={styles.returnsList}>
          {returns.length === 0 ? (
             <div className={styles.emptyStateCard}>
                <FaArrowRotateLeft size={60} color="var(--grey-600)" />
                <h3 className={styles.emptyTitle}>SIN DEVOLUCIONES ACTIVAS</h3>
                <p>No tienes ninguna solicitud de devolución en curso.</p>
                <Link href="/dashboard/pedidos" className={styles.ordersLink}>
                    Ver mis pedidos para solicitar devolución
                </Link>
             </div>
          ) : (
            returns.map((ret) => (
              <div key={ret.return_id} className={styles.returnCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.returnIdGroup}>
                        <span className={styles.returnLabel}>SOLICITUD</span>
                        <span className={styles.returnNumber}>#RET-{ret.return_id}</span>
                    </div>
                    <div className={`${styles.statusBadge} ${styles[ret.status]}`}>
                        <FaClock /> {ret.status.toUpperCase()}
                    </div>
                </div>

                <div className={styles.cardBody}>
                    <p className={styles.orderRef}>Pedido de referencia: **#{ret.order_id}**</p>
                    <p className={styles.reasonText}>Motivo: "{ret.reason}"</p>
                    <span className={styles.dateText}>Solicitado el {new Date(ret.creation_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
