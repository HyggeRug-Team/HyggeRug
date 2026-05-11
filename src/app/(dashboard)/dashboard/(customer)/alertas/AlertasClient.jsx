/**
 * @file AlertasClient.jsx
 * @description Componente cliente para gestionar la lista de notificaciones.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaCheckDouble, 
  FaCommentDots, 
  FaChevronRight,
  FaInbox,
  FaSpinner
} from 'react-icons/fa6';
import styles from './alertas.module.css';
import Link from 'next/link';

export default function AlertasClient() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Refresco automático cada 30 segundos en la página de alertas
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
      
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: id }),
      });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));

      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <FaSpinner className={styles.spinner} />
        <p>Sincronizando alertas...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className={styles.alertasWrapper}>
      <div className={styles.actions}>
        <motion.span 
          className={styles.count}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          key={unreadCount}
        >
          {unreadCount} {unreadCount === 1 ? 'notificación' : 'notificaciones'} sin leer
        </motion.span>
        {notifications.length > 0 && unreadCount > 0 && (
          <button className={styles.markAll} onClick={markAllAsRead}>
            <FaCheckDouble /> Marcar todas leídas
          </button>
        )}
      </div>

      <div className={styles.list}>
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div 
              className={styles.empty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <FaInbox size={60} style={{ opacity: 0.3 }} />
              <h3>Todo al día</h3>
              <p>No tienes notificaciones pendientes de revisión.</p>
            </motion.div>
          ) : (
            notifications.map((notif, index) => (
              <motion.div
                key={notif.notification_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${styles.card} ${!notif.is_read ? styles.unread : ''}`}
                onClick={() => !notif.is_read && markAsRead(notif.notification_id)}
              >
                <div className={styles.cardIcon}>
                  {notif.type === 'chat' ? <FaCommentDots /> : <FaBell />}
                  {!notif.is_read && <span className={styles.unreadDot} />}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <h4>{notif.title}</h4>
                    <span className={styles.date}>
                      {new Date(notif.creation_date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p>{notif.message}</p>
                  {notif.link && (
                    <Link href={notif.link} className={styles.cardLink}>
                      IR AL PEDIDO <FaChevronRight size={10} />
                    </Link>
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
