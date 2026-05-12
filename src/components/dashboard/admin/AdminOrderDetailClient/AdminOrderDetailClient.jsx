/**
 * @file AdminOrderDetailClient.jsx
 * @description Vista completa del detalle de un pedido para el administrador.
 *
 * [Estructura]
 * - Header: ID, estado, botones anterior/siguiente (mismo patrón que la lista)
 * - Tracker horizontal de pasos
 * - Grid de dos columnas:
 *   · Izquierda: artículos con sus 3 imágenes posibles (user_image, final_design, product_image)
 *   · Derecha: sidebar con contacto del usuario, dirección, precio editable y notas
 * - El botón de chat redirige a /dashboard/admin/usuarios (no abre modal)
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './AdminOrderDetailClient.module.css';

import {
  FaChevronLeft,
  FaChevronRight,
  FaPalette,
  FaSpinner,
  FaTruckFast,
  FaCircleCheck,
  FaLocationDot,
  FaFileInvoiceDollar,
  FaCalendarDays,
  FaCreditCard,
  FaCircleUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaPenToSquare,
  FaCheck,
  FaXmark,
  FaImage,
  FaCircleExclamation,
} from 'react-icons/fa6';
import { MdOutlinePayments } from 'react-icons/md';

/* ─────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE ESTADOS (igual que en la lista de pedidos)
   ───────────────────────────────────────────────────────────────── */

const STATUS_ORDER = [
  'diseñando',
  'pendiente de aprobación',
  'comprobando pago',
  'tejiendo',
  'enviado',
  'recibido',
];

const STATUS_CONFIG = {
  'diseñando':                { label: 'Diseñando',           icon: <FaPalette />,        color: 'var(--highlight-text)', shortLabel: 'DISEÑAR' },
  'pendiente de aprobación':  { label: 'Pend. Aprobación',    icon: <FaSpinner />,        color: 'var(--hover-text)',     shortLabel: 'REVISAR' },
  'comprobando pago':         { label: 'Comprobando Pago',    icon: <MdOutlinePayments />,color: 'orange',               shortLabel: 'PAGO' },
  'tejiendo':                 { label: 'Tejiendo',            icon: <FaPalette />,        color: '#c975ff',              shortLabel: 'TEJER' },
  'enviado':                  { label: 'Enviado',             icon: <FaTruckFast />,      color: 'var(--button-before-hover)', shortLabel: 'ENVIAR' },
  'recibido':                 { label: 'Entregado',           icon: <FaCircleCheck />,    color: '#00ff80',              shortLabel: 'ENTREGADO' },
};

const STEPS = [
  { id: 1, status: 'diseñando',               label: 'Diseñando',  icon: <FaPalette size={14} /> },
  { id: 2, status: 'pendiente de aprobación', label: 'Revisando',  icon: <FaSpinner size={14} /> },
  { id: 3, status: 'comprobando pago',        label: 'Pago',       icon: <MdOutlinePayments size={14} /> },
  { id: 4, status: 'tejiendo',                label: 'En taller',  icon: <FaPalette size={14} /> },
  { id: 5, status: 'enviado',                 label: 'Enviado',    icon: <FaTruckFast size={14} /> },
  { id: 6, status: 'recibido',                label: 'Entregado',  icon: <FaCircleCheck size={14} /> },
];

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
   ───────────────────────────────────────────────────────────────── */

export default function AdminOrderDetailClient({ order: initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [statusLoading, setStatusLoading] = useState(false);

  const currentIdx  = STATUS_ORDER.indexOf(order.order_status);
  const prevStatus  = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null;
  const nextStatus  = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;
  const statusCfg   = STATUS_CONFIG[order.order_status] || {};
  const currentStep = currentIdx + 1;

  const orderDate = new Date(order.creation_date).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // Cambia el estado del pedido con actualización optimista
  const handleStatusChange = useCallback(async (newStatus) => {
    const prev = order.order_status;
    setOrder(o => ({ ...o, order_status: newStatus }));
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.order_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setOrder(o => ({ ...o, order_status: prev }));
    } finally {
      setStatusLoading(false);
    }
  }, [order.order_id, order.order_status]);

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/dashboard/admin/pedidos" className={styles.backBtn}>
            <FaChevronLeft /> VOLVER
          </Link>
          <h1 className={styles.title}>Pedido <span>#{order.order_id}</span></h1>
        </div>

        {/* Controles de estado en el header */}
        <div className={styles.headerActions}>
          {prevStatus && (
            <button
              className={styles.statusBtnPrev}
              onClick={() => handleStatusChange(prevStatus)}
              disabled={statusLoading}
              title={`Revertir a: ${STATUS_CONFIG[prevStatus]?.label}`}
            >
              <FaChevronLeft />
              {STATUS_CONFIG[prevStatus]?.shortLabel}
            </button>
          )}
          <div className={styles.statusBadge} style={{ '--status-color': statusCfg.color }}>
            {statusCfg.icon}
            <span>{statusCfg.label?.toUpperCase()}</span>
          </div>
          {nextStatus && (
            <button
              className={styles.statusBtnNext}
              onClick={() => handleStatusChange(nextStatus)}
              disabled={statusLoading}
              title={`Avanzar a: ${STATUS_CONFIG[nextStatus]?.label}`}
              style={{ '--next-color': STATUS_CONFIG[nextStatus]?.color }}
            >
              {STATUS_CONFIG[nextStatus]?.shortLabel}
              <FaChevronRight />
            </button>
          )}
        </div>
      </header>

      {/* ── TRACKER HORIZONTAL ── */}
      <section className={styles.trackerCard}>
        <div className={styles.trackerWrapper}>
          <div className={styles.trackerLine}>
            <div
              className={styles.trackerProgress}
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STEPS.map(step => {
            const isActive = currentStep >= step.id;
            const isDone   = currentStep > step.id;
            return (
              <div key={step.id} className={`${styles.trackerStep} ${isActive ? styles.trackerStepActive : ''}`}>
                <div className={styles.trackerDot}>
                  {isDone ? <FaCircleCheck size={18} /> : isActive ? step.icon : step.id}
                </div>
                <span className={styles.trackerLabel}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── GRID PRINCIPAL ── */}
      <div className={styles.grid}>

        {/* ── COLUMNA IZQUIERDA: Artículos ── */}
        <section className={styles.itemsSection}>
          <h2 className={styles.sectionTitle}>Artículos del pedido</h2>
          <div className={styles.itemsList}>
            {order.items.map((item, idx) => (
              <OrderItemCard key={item.order_product_id || idx} item={item} />
            ))}
          </div>
        </section>

        {/* ── COLUMNA DERECHA: Sidebar ── */}
        <aside className={styles.sidebar}>

          {/* Contacto del cliente */}
          <UserContactCard
            user={{
              user_id:       order.user_id,
              nickname:      order.nickname,
              email:         order.email,
              profile_image: order.profile_image,
            }}
          />

          {/* Precio — editable si está en 'pendiente de aprobación' */}
          <PriceCard
            orderId={order.order_id}
            totalAmount={order.total_amount}
            isPendingApproval={order.order_status === 'pendiente de aprobación'}
            onPriceUpdate={newAmount => setOrder(o => ({ ...o, total_amount: newAmount }))}
          />

          {/* Dirección de envío */}
          {(order.ciudad || order.calle) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><FaLocationDot /> Dirección de envío</h3>
              <div className={styles.addressInfo}>
                <p className={styles.addressCity}>{order.ciudad} ({order.provincia})</p>
                <p>{order.calle}, {order.portal_piso_puerta}</p>
                <p>{order.codigo_postal}</p>
                {order.phone_number && (
                  <p className={styles.addressPhone}><FaPhone size={11} /> {order.phone_number}</p>
                )}
              </div>
            </div>
          )}

          {/* Notas del pedido */}
          {order.customer_note && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><FaCircleExclamation /> Nota del cliente</h3>
              <p className={styles.noteText}>{order.customer_note}</p>
            </div>
          )}

          {/* Metadatos del pedido */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FaFileInvoiceDollar /> Info del pedido</h3>
            <div className={styles.metaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}><FaCalendarDays /> Fecha</span>
                <span className={styles.metaValue}>{orderDate}</span>
              </div>
              {order.payment_method && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}><FaCreditCard /> Método de pago</span>
                  <span className={styles.metaValue}>{order.payment_method}</span>
                </div>
              )}
              {order.payment_id && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>ID Pago</span>
                  <span className={`${styles.metaValue} ${styles.metaCode}`}>{order.payment_id}</span>
                </div>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TARJETA DE ARTÍCULO
   Muestra las 3 imágenes posibles con sus etiquetas.
   ───────────────────────────────────────────────────────────────── */

function OrderItemCard({ item }) {
  // Construimos la lista de imágenes disponibles con etiqueta para cada una
  const images = [
    item.user_image    && { url: item.user_image,    label: 'Imagen del cliente' },
    item.final_design  && { url: item.final_design,  label: 'Diseño final' },
    item.product_image && { url: item.product_image, label: 'Imagen del producto' },
  ].filter(Boolean);

  return (
    <div className={styles.itemCard}>
      {/* Info del artículo */}
      <div className={styles.itemHeader}>
        <div className={styles.itemInfo}>
          <h3 className={styles.itemName}>{item.product_name || 'Producto sin nombre'}</h3>
          <div className={styles.itemMeta}>
            {item.size && <span className={styles.itemMetaChip}>{item.size}</span>}
            <span className={styles.itemMetaChip}>x{item.quantity}</span>
            <span className={styles.itemMetaChip}>{parseFloat(item.unit_price || 0).toFixed(2)}€/ud</span>
          </div>
        </div>
        <span className={styles.itemTotal}>
          {(parseFloat(item.unit_price || 0) * item.quantity).toFixed(2)}€
        </span>
      </div>

      {/* Nota del artículo si existe */}
      {item.customer_note && (
        <div className={styles.itemNote}>
          <FaCircleExclamation />
          <p>{item.customer_note}</p>
        </div>
      )}

      {/* Imágenes del artículo */}
      {images.length > 0 ? (
        <div className={styles.imagesGrid}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <span className={styles.imageLabel}>{img.label}</span>
              <a href={img.url} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
                <img src={img.url} alt={img.label} className={styles.itemImage} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noImages}>
          <FaImage /> Sin imágenes adjuntas
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TARJETA DE CONTACTO DEL USUARIO
   Muestra avatar, nombre, email y enlace al chat en usuarios.
   ───────────────────────────────────────────────────────────────── */

function UserContactCard({ user }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}><FaCircleUser /> Cliente</h3>
      <div className={styles.userContact}>
        <div className={styles.userContactAvatar}>
          {user.profile_image
            ? <img src={user.profile_image} alt={user.nickname} />
            : <FaCircleUser size={36} />
          }
        </div>
        <div className={styles.userContactInfo}>
          <span className={styles.userContactName}>{user.nickname || '—'}</span>
          <a href={`mailto:${user.email}`} className={styles.userContactEmail}>
            <FaEnvelope /> {user.email}
          </a>
        </div>
      </div>
      {/* El chat redirige al panel de usuarios donde el admin puede abrirlo */}
      <Link
        href="/dashboard/admin/usuarios"
        className={styles.chatLink}
      >
        <FaComment /> IR AL CHAT
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TARJETA DE PRECIO
   Editable inline solo cuando el estado es 'pendiente de aprobación'.
   ───────────────────────────────────────────────────────────────── */

function PriceCard({ orderId, totalAmount, isPendingApproval, onPriceUpdate }) {
  const [editing, setEditing]   = useState(false);
  const [value, setValue]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const handleEdit = () => {
    setValue(parseFloat(totalAmount || 0).toFixed(2));
    setEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
  };

  const handleSave = async () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) {
      setError('Introduce un precio válido');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_amount: parsed }),
      });
      if (!res.ok) throw new Error();
      onPriceUpdate(parsed);
      setEditing(false);
    } catch {
      setError('Error al guardar el precio');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${styles.card} ${isPendingApproval ? styles.cardHighlight : ''}`}>
      <h3 className={styles.cardTitle}>
        <FaFileInvoiceDollar />
        {isPendingApproval ? 'Fijar precio del pedido' : 'Precio del pedido'}
      </h3>

      {editing ? (
        <div className={styles.priceEditWrapper}>
          <div className={styles.priceInputRow}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={e => setValue(e.target.value)}
              className={styles.priceInput}
              autoFocus
            />
            <span className={styles.priceCurrency}>€</span>
          </div>
          {error && <p className={styles.priceError}>{error}</p>}
          <div className={styles.priceEditActions}>
            <button className={styles.priceCancel} onClick={handleCancel} disabled={saving}>
              <FaXmark /> Cancelar
            </button>
            <button className={styles.priceSave} onClick={handleSave} disabled={saving}>
              {saving ? <FaSpinner className={styles.spinIcon} /> : <FaCheck />}
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.priceDisplay}>
          <span className={styles.priceAmount}>
            {parseFloat(totalAmount || 0).toFixed(2)}€
          </span>
          {isPendingApproval && (
            <button className={styles.priceEditBtn} onClick={handleEdit}>
              <FaPenToSquare /> Editar precio
            </button>
          )}
        </div>
      )}

      <div className={styles.priceSummaryRows}>
        <div className={styles.priceSummaryRow}>
          <span>Envío</span>
          <span className={styles.free}>GRATIS</span>
        </div>
        <div className={`${styles.priceSummaryRow} ${styles.priceTotalRow}`}>
          <span>Total</span>
          <span>{parseFloat(totalAmount || 0).toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
}
