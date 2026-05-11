/**
 * @file NotificationListener.jsx
 * @description Componente global que escucha nuevas notificaciones y muestra un popup.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaXmark, FaCircleInfo } from 'react-icons/fa6';
import styles from './NotificationListener.module.css';
import Link from 'next/link';

export default function NotificationListener() {
  const [activeNotification, setActiveNotification] = useState(null);
  const [lastNotifId, setLastNotifId] = useState(null);

  const fetchLatestNotification = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        const latest = data.notifications[0];

        if (latest && !latest.is_read) {
          // Si es una notificación nueva que no hemos mostrado ya
          if (latest.notification_id !== lastNotifId) {
            setLastNotifId(latest.notification_id);
            setActiveNotification(latest);
            
            // Auto-cerrar después de 8 segundos
            setTimeout(() => {
              setActiveNotification(null);
            }, 8000);
          }
        }
      }
    } catch (err) {
      console.error('Error polling notifications:', err);
    }
  }, [lastNotifId]);

  useEffect(() => {
    // Polling cada 10 segundos
    const interval = setInterval(fetchLatestNotification, 10000);
    // Ejecución inicial
    fetchLatestNotification();
    return () => clearInterval(interval);
  }, [fetchLatestNotification]);

  const handleClose = () => {
    setActiveNotification(null);
  };

  return (
    <AnimatePresence>
      {activeNotification && (
        <motion.div 
          className={styles.notificationToast}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
        >
          <Link href={activeNotification.link || '#'} onClick={handleClose} className={styles.cardLink}>
            <div className={styles.icon}>
              <FaBell />
            </div>
            <div className={styles.content}>
              <h4>{activeNotification.title}</h4>
              <p>{activeNotification.message}</p>
              <span className={styles.hint}>Toca para ver detalles</span>
            </div>
          </Link>
          <button onClick={(e) => { e.stopPropagation(); handleClose(); }} className={styles.closeBtn}>
            <FaXmark />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
