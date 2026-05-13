/**
 * @file DevolucionesClient.jsx
 * @description Componente de cliente para el listado de devoluciones.
 */

'use client';

import React from 'react';
import styles from "./devoluciones.module.css";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import { 
  FaArrowRotateLeft, 
  FaClock, 
  FaCircleInfo,
  FaBagShopping
} from "react-icons/fa6";
import DashboardHeader from "@/components/dashboard/DashboardHeader/DashboardHeader";

export default function DevolucionesClient({ returns, session }) {
  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader 
        session={session} 
        title="Tus Devoluciones"
        description="Rastrea el estado de tus solicitudes de retorno y post-venta."
      />

      <main className={styles.mainContent}>
        <div className={styles.infoBanner}>
            <FaCircleInfo className={styles.infoIcon} />
            <p>Las devoluciones están sujetas a revisión. Una vez aprobada, recibirás las instrucciones de envío por email.</p>
        </div>

        <div className={styles.returnsList}>
          {returns.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <FaArrowRotateLeft size={40} />
              </div>
              <h3>Sin devoluciones activas</h3>
              <p>No tienes ninguna solicitud de devolución en curso. Si necesitas devolver un producto, ve a la sección de tus pedidos.</p>
              <Link href="/dashboard/pedidos" className={styles.primaryLink}>
                  <FaBagShopping /> IR A MIS PEDIDOS
              </Link>
            </div>
          ) : (
            returns.map((ret) => (
              <div key={ret.return_id} className={styles.returnCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.idGroup}>
                    <span className={styles.idLabel}>SOLICITUD</span>
                    <span className={styles.idValue}>#RET-{ret.return_id}</span>
                  </div>
                  <div className={`${styles.statusBadge} ${styles[ret.status]}`}>
                    <FaClock /> {ret.status.toUpperCase()}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metaInfo}>
                    <p><strong>Pedido:</strong> #{ret.order_id}</p>
                    <p><strong>Solicitado:</strong> {new Date(ret.creation_date).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.reasonBox}>
                    <p>&quot;{ret.reason}&quot;</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
