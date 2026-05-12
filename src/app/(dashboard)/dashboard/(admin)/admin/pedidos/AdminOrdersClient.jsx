/**
 * @file AdminOrdersClient.jsx
 * @description Componente cliente para la gestión de pedidos en el panel de admin.
 *
 * [Estructura]
 * Un acordeón por cada estado del pedido (excluido 'en_carrito').
 * - 'recibido' aparece al final, cerrado por defecto, con estética de "archivado".
 * - El resto de grupos están abiertos al cargar la página.
 * - Cada tarjeta permite avanzar/retroceder el estado con actualización optimista:
 *   la tarjeta se mueve de grupo al instante y revierte si la API falla.
 * - Los pedidos dentro de cada grupo siguen orden FIFO (más antiguos primero).
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './AdminOrdersClient.module.css';

import {
  FaPalette,
  FaSpinner,
  FaTruckFast,
  FaCircleCheck,
  FaCalendarDays,
  FaFileInvoiceDollar,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUpRightFromSquare,
  FaCircleExclamation,
  FaCircleUser,
} from 'react-icons/fa6';
import { MdOutlinePayments } from 'react-icons/md';

/* ─────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE ESTADOS
   Orden, iconos, colores y etiquetas cortas para los botones.
   ───────────────────────────────────────────────────────────────── */

// El orden define también la secuencia de avance/retroceso
const STATUS_ORDER = [
  'diseñando',
  'pendiente de aprobación',
  'comprobando pago',
  'tejiendo',
  'enviado',
  'recibido',
];

const STATUS_CONFIG = {
  'diseñando': {
    label: 'Diseñando',
    icon: <FaPalette />,
    color: 'var(--highlight-text)',
    nextShort: 'REVISAR',
  },
  'pendiente de aprobación': {
    label: 'Pendiente de aprobación',
    icon: <FaSpinner />,
    color: 'var(--hover-text)',
    prevShort: 'DISEÑAR',
    nextShort: 'PAGO',
  },
  'comprobando pago': {
    label: 'Comprobando pago',
    icon: <MdOutlinePayments />,
    color: 'orange',
    prevShort: 'REVISAR',
    nextShort: 'TEJER',
  },
  'tejiendo': {
    label: 'Tejiendo',
    icon: <FaPalette />,
    color: '#c975ff',
    prevShort: 'PAGO',
    nextShort: 'ENVIAR',
  },
  'enviado': {
    label: 'Enviado',
    icon: <FaTruckFast />,
    color: 'var(--button-before-hover)',
    prevShort: 'TEJER',
    nextShort: 'ENTREGADO',
  },
  'recibido': {
    label: 'Entregado',
    icon: <FaCircleCheck />,
    color: '#00ff80',
    prevShort: 'REVERTIR',
  },
};

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL — AdminOrdersClient
   ───────────────────────────────────────────────────────────────── */

export default function AdminOrdersClient({ initialOrders }) {
  // Estado mutable de pedidos para permitir actualizaciones optimistas
  const [orders, setOrders] = useState(initialOrders);

  // Grupos abiertos: todos abiertos excepto 'recibido' (archivado)
  const [openGroups, setOpenGroups] = useState(() =>
    STATUS_ORDER.reduce((acc, status) => {
      acc[status] = status !== 'recibido';
      return acc;
    }, {})
  );

  // Pedidos en proceso de cambio de estado (para mostrar spinner y bloquear botones)
  const [loadingOrders, setLoadingOrders] = useState({});

  // Pedidos agrupados por estado — derivado del array de orders
  const groupedOrders = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = orders.filter(o => o.order_status === status);
    return acc;
  }, {});

  // Total de pedidos activos (todo excepto recibido)
  const activeCount = orders.filter(o => o.order_status !== 'recibido').length;

  /** Abre/cierra un acordeón */
  const toggleGroup = (status) => {
    setOpenGroups(prev => ({ ...prev, [status]: !prev[status] }));
  };

  /**
   * Cambia el estado de un pedido con actualización optimista.
   * 1. Actualizamos el estado local inmediatamente (UX instantánea).
   * 2. Lanzamos la llamada a la API.
   * 3. Si falla, revertimos al estado anterior.
   */
  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    // Guardamos snapshot para poder revertir si hay error
    const snapshot = [...orders];

    // Actualización optimista: movemos la tarjeta al nuevo grupo al instante
    setOrders(prev =>
      prev.map(o => o.order_id === orderId ? { ...o, order_status: newStatus } : o)
    );
    setLoadingOrders(prev => ({ ...prev, [orderId]: true }));

    // Abrimos el grupo destino automáticamente para que el admin vea adónde fue
    setOpenGroups(prev => ({ ...prev, [newStatus]: true }));

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Respuesta API:', errorData); // Añade esto
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      // Revertimos al estado previo si la API falla
      console.error('[Admin] Error al cambiar estado:', err);
      setOrders(snapshot);
    } finally {
      setLoadingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  }, [orders]);

  return (
    <div className={styles.container}>

      {/* CABECERA DE LA PÁGINA */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Pedidos</h1>
          <span className={styles.activeBadge}>{activeCount} en curso</span>
        </div>
        <p className={styles.pageSubtitle}>
          Gestiona y avanza el estado de cada pedido desde aquí.
        </p>
      </div>

      {/* LISTA DE ACORDEONES — uno por cada estado */}
      <div className={styles.accordionList}>
        {STATUS_ORDER.map(status => {
          const config = STATUS_CONFIG[status];
          const groupOrders = groupedOrders[status];
          const isOpen = openGroups[status];
          const isCompleted = status === 'recibido';

          return (
            <div
              key={status}
              className={`${styles.accordionGroup} ${isCompleted ? styles.completedGroup : ''}`}
              style={{ '--group-color': config.color }}
            >
              {/* CABECERA DEL ACORDEÓN */}
              <button
                className={styles.accordionHeader}
                onClick={() => toggleGroup(status)}
              >
                <div className={styles.accordionHeaderLeft}>
                  <span className={styles.accordionIcon}>{config.icon}</span>
                  <span className={styles.accordionLabel}>{config.label.toUpperCase()}</span>
                  <span className={styles.accordionCount}>{groupOrders.length}</span>
                </div>
                <div className={styles.accordionHeaderRight}>
                  {isCompleted && (
                    <span className={styles.archivedTag}>ARCHIVADO</span>
                  )}
                  <motion.span
                    className={styles.chevron}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <FaChevronDown />
                  </motion.span>
                </div>
              </button>

              {/* CUERPO DEL ACORDEÓN — animado con AnimatePresence */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className={styles.accordionBody}>
                      {groupOrders.length === 0 ? (
                        /* Estado vacío del grupo */
                        <div className={styles.emptyGroup}>
                          <span>Sin pedidos en este estado</span>
                        </div>
                      ) : (
                        /* Grid de tarjetas con animación al entrar/salir */
                        <div className={styles.cardsGrid}>
                          <AnimatePresence mode="popLayout">
                            {groupOrders.map(order => (
                              <AdminOrderCard
                                key={order.order_id}
                                order={order}
                                config={config}
                                isCompleted={isCompleted}
                                isLoading={!!loadingOrders[order.order_id]}
                                onStatusChange={handleStatusChange}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE TARJETA — AdminOrderCard
   Muestra la información de un pedido y los controles de estado.
   ───────────────────────────────────────────────────────────────── */

function AdminOrderCard({ order, config, isCompleted, isLoading, onStatusChange }) {
  // Calculamos los estados anterior y siguiente según el array de orden
  const currentIdx = STATUS_ORDER.indexOf(order.order_status);
  const prevStatus = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null;
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;
  const prevConfig = prevStatus ? STATUS_CONFIG[prevStatus] : null;
  const nextConfig = nextStatus ? STATUS_CONFIG[nextStatus] : null;

  // Formateamos la fecha de creación para mostrarla de forma legible
  const orderDate = new Date(order.creation_date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isCompleted ? 0.75 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${styles.orderCard} ${isCompleted ? styles.completedCard : ''}`}
      style={{ '--card-accent': config.color }}
    >
      {/* ── CABECERA DE TARJETA: ID del pedido + info del usuario ── */}
      <div className={styles.cardHeader}>
        <div className={styles.cardOrderId}>
          <span className={styles.cardIdLabel}>ORDEN</span>
          <span className={styles.cardIdNumber}>#{order.order_id}</span>
        </div>

        <div className={styles.cardUser}>
          {order.profile_image ? (
            <img
              src={order.profile_image}
              alt={order.nickname || 'Usuario'}
              className={styles.cardAvatar}
            />
          ) : (
            <span className={styles.cardAvatarFallback}>
              <FaCircleUser />
            </span>
          )}
          <div className={styles.cardUserInfo}>
            <span className={styles.cardUserName}>{order.nickname || 'Sin usuario'}</span>
            <span className={styles.cardUserEmail}>{order.email || '—'}</span>
          </div>
        </div>
      </div>

      {/* ── CUERPO: Fecha, total, nota y preview de artículos ── */}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <FaCalendarDays />
            <span>{orderDate}</span>
          </div>
          <div className={styles.metaItem}>
            <FaFileInvoiceDollar />
            <span>{parseFloat(order.total_amount || 0).toFixed(2)}€</span>
          </div>
          {/* Indicador visual si el pedido tiene nota del cliente */}
          {order.customer_note && (
            <div className={`${styles.metaItem} ${styles.noteTag}`}>
              <FaCircleExclamation />
              <span>Con nota</span>
            </div>
          )}
        </div>

        {/* Miniaturas de los artículos del pedido */}
        <div className={styles.itemsPreview}>
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} className={styles.itemThumb}>
              <img
                src={item.image_url || '/placeholder-rug.png'}
                alt={item.product_name || 'Artículo'}
              />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className={styles.moreItems}>+{order.items.length - 3}</div>
          )}
          {order.items.length === 0 && (
            <span className={styles.noItems}>Sin artículos</span>
          )}
        </div>
      </div>

      {/* ── ACCIONES: Cambio de estado + acceso al detalle ── */}
      <div className={styles.cardActions}>
        {/* Botón retroceder estado */}
        {prevStatus && (
          <button
            className={`${styles.statusBtn} ${styles.statusBtnPrev} ${isCompleted ? styles.revertBtn : ''}`}
            onClick={() => onStatusChange(order.order_id, prevStatus)}
            disabled={isLoading}
            title={`Revertir a: ${prevConfig.label}`}
          >
            <FaChevronLeft />
            {prevConfig.prevShort || prevConfig.label.split(' ')[0].toUpperCase()}
          </button>
        )}

        {/* Enlace al detalle del pedido */}
        <Link
          href={`/dashboard/admin/pedidos/${order.order_id}`}
          className={styles.detailLink}
          title="Ver detalle completo del pedido"
        >
          VER <FaArrowUpRightFromSquare />
        </Link>

        {/* Botón avanzar estado */}
        {nextStatus && (
          <button
            className={`${styles.statusBtn} ${styles.statusBtnNext}`}
            onClick={() => onStatusChange(order.order_id, nextStatus)}
            disabled={isLoading}
            title={`Avanzar a: ${nextConfig.label}`}
          >
            {nextConfig.nextShort || nextConfig.label.split(' ')[0].toUpperCase()}
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* ── OVERLAY de carga mientras se procesa el cambio de estado ── */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <FaSpinner className={styles.spinIcon} />
        </div>
      )}
    </motion.div>
  );
}
