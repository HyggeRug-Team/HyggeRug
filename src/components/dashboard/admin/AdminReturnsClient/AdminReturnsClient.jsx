/**
 * @file AdminReturnsClient.jsx
 * @description Gestión de devoluciones con diseño premium alineado con el sistema del proyecto.
 */

'use client';

import React, { useState } from 'react';
import styles from './AdminReturns.module.css';
import { 
  FaArrowRotateLeft, 
  FaCircleCheck, 
  FaXmark, 
  FaClock, 
  FaBoxOpen,
  FaCalendarDays,
  FaUser,
  FaCheckDouble
} from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';

export default function AdminReturnsClient({ initialReturns, session }) {
  const [returns, setReturns] = useState(initialReturns);

  const handleStatusUpdate = async (returnId, newStatus) => {
    try {
      const res = await fetch(`/api/returns`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnId, status: newStatus })
      });

      if (res.ok) {
        setReturns(returns.map(r => r.return_id === returnId ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      console.error("Error al actualizar devolución:", err);
    }
  };

  return (
    <div className={styles.container}>
      <DashboardHeader 
        session={session} 
        isAdmin={true} 
        title="Gestión de Devoluciones"
        description="Control de incidencias y solicitudes de post-venta."
      />
      
      <div className={styles.returnsGrid}>
        <AnimatePresence mode="popLayout">
          {returns.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={styles.emptyState}
            >
              No hay solicitudes de devolución pendientes.
            </motion.div>
          ) : (
            returns.map((ret) => (
              <motion.div
                key={ret.return_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.returnCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderLabel}>SOLICITUD #RET-{ret.return_id}</span>
                    <span className={styles.returnId}>Pedido: #{ret.order_id}</span>
                  </div>
                  <div className={`${styles.statusBadge} ${styles['status' + ret.status]}`}>
                    <FaClock /> {ret.status.toUpperCase()}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.dataRow}>
                    <FaUser className={styles.rowIcon} />
                    <span>{ret.user_name}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <FaCalendarDays className={styles.rowIcon} />
                    <span>{new Date(ret.creation_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className={styles.reasonBox}>
                    <label>Motivo del cliente:</label>
                    <p>{ret.reason}</p>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {ret.status === 'pendiente' && (
                    <div className={styles.actionGroup}>
                      <button 
                        onClick={() => handleStatusUpdate(ret.return_id, 'aprobada')}
                        className={styles.approveBtn}
                      >
                        <FaCircleCheck /> APROBAR
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(ret.return_id, 'rechazada')}
                        className={styles.rejectBtn}
                      >
                        <FaXmark /> RECHAZAR
                      </button>
                    </div>
                  )}

                  {ret.status === 'aprobada' && (
                    <button 
                      onClick={() => handleStatusUpdate(ret.return_id, 'completada')}
                      className={styles.completeBtn}
                    >
                      <FaCheckDouble /> MARCAR COMO COMPLETADA
                    </button>
                  )}

                  {ret.status === 'completada' && (
                    <div className={styles.completedNote}>
                      <FaCheckDouble /> DEVOLUCIÓN FINALIZADA
                    </div>
                  )}

                  {ret.status === 'rechazada' && (
                    <div className={styles.rejectedNote}>
                      <FaXmark /> SOLICITUD RECHAZADA
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
