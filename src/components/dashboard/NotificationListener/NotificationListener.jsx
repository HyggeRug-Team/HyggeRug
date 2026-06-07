'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaXmark } from 'react-icons/fa6';
import styles from './NotificationListener.module.css';
import Link from 'next/link';

export default function NotificationListener() {
  const [activeNotification, setActiveNotification] = useState(null);
  const lastNotifIdRef = useRef(null);
  const autoCloseRef = useRef(null);

  useEffect(() => {
    async function fetchLatestNotification() {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = await res.json();
        const latest = data.notifications[0];

        if (latest && !latest.is_read && latest.notification_id !== lastNotifIdRef.current) {
          lastNotifIdRef.current = latest.notification_id;
          setActiveNotification(latest);
          if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
          autoCloseRef.current = setTimeout(() => setActiveNotification(null), 8000);
        }
      } catch (err) {
        console.error('Error polling notifications:', err);
      }
    }

    fetchLatestNotification();
    const interval = setInterval(fetchLatestNotification, 10000);

    return () => {
      clearInterval(interval);
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, []); // Efecto estable: función definida localmente, no hay dependencias externas

  const handleClose = () => setActiveNotification(null);

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
