/**
 * @file AdminOrderDetailClient.jsx
 * @description Vista completa del detalle de un pedido para el administrador.
 *
 * [Novedades]
 * - ImageModal: abre cualquier imagen a pantalla completa con botón de descarga
 * - Badges de comunidad/público en cada artículo
 * - Slot de diseño ajustado (adjusted_image) al final de las imágenes
 * - Subida de adjusted_image solo disponible en estado 'diseñando'
 * - Fila de descuento en el resumen de precio
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './AdminOrderDetailClient.module.css';

import {
  FaChevronLeft, FaChevronRight, FaPalette, FaSpinner, FaTruckFast,
  FaCircleCheck, FaLocationDot, FaFileInvoiceDollar, FaCalendarDays,
  FaCreditCard, FaCircleUser, FaEnvelope, FaPhone, FaComment,
  FaPenToSquare, FaCheck, FaXmark, FaImage, FaCircleExclamation,
  FaDownload, FaArrowUpFromBracket, FaUsers, FaLock, FaUnlock, FaTag,
} from 'react-icons/fa6';
import { MdOutlinePayments } from 'react-icons/md';

/* ─────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE ESTADOS
   ───────────────────────────────────────────────────────────────── */

const STATUS_ORDER = ['diseñando', 'pendiente de aprobación', 'comprobando pago', 'tejiendo', 'enviado', 'recibido'];

const STATUS_CONFIG = {
  'diseñando': { label: 'Diseñando', icon: <FaPalette />, color: 'var(--highlight-text)', shortLabel: 'DISEÑAR' },
  'pendiente de aprobación': { label: 'Pend. Aprobación', icon: <FaSpinner />, color: 'var(--hover-text)', shortLabel: 'REVISAR' },
  'comprobando pago': { label: 'Comprobando Pago', icon: <MdOutlinePayments />, color: 'orange', shortLabel: 'PAGO' },
  'tejiendo': { label: 'Tejiendo', icon: <FaPalette />, color: '#c975ff', shortLabel: 'TEJER' },
  'enviado': { label: 'Enviado', icon: <FaTruckFast />, color: 'var(--button-before-hover)', shortLabel: 'ENVIAR' },
  'recibido': { label: 'Entregado', icon: <FaCircleCheck />, color: '#00ff80', shortLabel: 'ENTREGADO' },
};

const STEPS = [
  { id: 1, label: 'Diseñando', icon: <FaPalette size={14} /> },
  { id: 2, label: 'Revisando', icon: <FaSpinner size={14} /> },
  { id: 3, label: 'Pago', icon: <MdOutlinePayments size={14} /> },
  { id: 4, label: 'En taller', icon: <FaPalette size={14} /> },
  { id: 5, label: 'Enviado', icon: <FaTruckFast size={14} /> },
  { id: 6, label: 'Entregado', icon: <FaCircleCheck size={14} /> },
];

/* ─────────────────────────────────────────────────────────────────
   UTILIDAD: descarga una imagen con fallback a nueva pestaña
   ───────────────────────────────────────────────────────────────── */
async function downloadImage(url, label = 'imagen') {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = label.replace(/\s+/g, '_').toLowerCase();
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
}
/* ─────────────────────────────────────────────────────────────────
   FORMAT DATE — formateo de fechas de forma manual
   ───────────────────────────────────────────────────────────────── */
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const hour = String(d.getUTCHours()).padStart(2, '0');
    const min = String(d.getUTCMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hour}:${min}`;
  }

/* ─────────────────────────────────────────────────────────────────
   IMAGE MODAL — pantalla completa con descarga
   ───────────────────────────────────────────────────────────────── */
function ImageModal({ image, onClose }) {
  return (
    <motion.div
      className={styles.modalBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalLabel}>{image.label}</span>
          <div className={styles.modalActions}>
            <button
              className={styles.modalDownloadBtn}
              onClick={() => downloadImage(image.url, image.label)}
            >
              <FaDownload /> Descargar
            </button>
            <button className={styles.modalCloseBtn} onClick={onClose}>
              <FaXmark />
            </button>
          </div>
        </div>
        <img src={image.url} alt={image.label} className={styles.modalImage} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
   ───────────────────────────────────────────────────────────────── */
export default function AdminOrderDetailClient({ order: initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [statusLoading, setStatusLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const currentIdx = STATUS_ORDER.indexOf(order.order_status);
  const prevStatus = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null;
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;
  const statusCfg = STATUS_CONFIG[order.order_status] || {};
  const currentStep = currentIdx + 1;

  const orderDate = formatDate(order.creation_date);

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

  // Actualiza el adjusted_image de un item en el estado local tras subida exitosa
  const handleAdjustedImageUpdate = useCallback((orderProductId, newUrl) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.order_product_id === orderProductId
          ? { ...item, adjusted_image: newUrl }
          : item
      ),
    }));
  }, []);

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/dashboard/admin/pedidos" className={styles.backBtn}>
            <FaChevronLeft /> VOLVER AL LISTADO
          </Link>
          <SectionHeader 
            badge={`PEDIDO #${order.order_id}`}
            title="Gestión de Pedido"
            description={`Creado el ${orderDate}`}
          />
        </div>
        <div className={styles.headerActions}>
          {prevStatus && (
            <button className={styles.statusBtnPrev} onClick={() => handleStatusChange(prevStatus)} disabled={statusLoading}>
              <FaChevronLeft /> {STATUS_CONFIG[prevStatus]?.shortLabel}
            </button>
          )}
          <div className={styles.statusBadge} style={{ '--status-color': statusCfg.color }}>
            {statusCfg.icon} <span>{statusCfg.label?.toUpperCase()}</span>
          </div>
          {nextStatus && (
            <button className={styles.statusBtnNext} onClick={() => handleStatusChange(nextStatus)} disabled={statusLoading} style={{ '--next-color': STATUS_CONFIG[nextStatus]?.color }}>
              {STATUS_CONFIG[nextStatus]?.shortLabel} <FaChevronRight />
            </button>
          )}
        </div>
      </header>

      {/* ── TRACKER ── */}
      <section className={styles.trackerCard}>
        <div className={styles.trackerWrapper}>
          <div className={styles.trackerLine}>
            <div className={styles.trackerProgress} style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
          </div>
          {STEPS.map(step => {
            const isActive = currentStep >= step.id;
            const isDone = currentStep > step.id;
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
        <section className={styles.itemsSection}>
          <h2 className={styles.sectionTitle}>Artículos del pedido</h2>
          <div className={styles.itemsList}>
            {order.items.map((item, idx) => (
              <OrderItemCard
                key={item.order_product_id || idx}
                item={item}
                isReviewing={order.order_status === 'pendiente de aprobación'}
                onOpenImage={setModalImage}
                onAdjustedImageUpdate={handleAdjustedImageUpdate}
              />
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <UserContactCard user={{ nickname: order.nickname, email: order.email, profile_image: order.profile_image }} />

          <PriceCard
            orderId={order.order_id}
            totalAmount={order.total_amount}
            isPendingApproval={order.order_status === 'pendiente de aprobación'}
            discountCode={order.discount_code}
            discountType={order.discount_type}
            discountValue={order.discount_value}
            onPriceUpdate={newAmount => setOrder(o => ({ ...o, total_amount: newAmount }))}
          />

          {(order.ciudad || order.calle) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><FaLocationDot /> Dirección de envío</h3>
              <div className={styles.addressInfo}>
                <p className={styles.addressCity}>{order.ciudad} ({order.provincia})</p>
                <p>{order.calle}, {order.portal_piso_puerta}</p>
                <p>{order.codigo_postal}</p>
                {order.phone_number && <p className={styles.addressPhone}><FaPhone size={11} /> {order.phone_number}</p>}
              </div>
            </div>
          )}

          {order.customer_note && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><FaCircleExclamation /> Nota del cliente</h3>
              <p className={styles.noteText}>{order.customer_note}</p>
            </div>
          )}

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

      {/* MODAL DE IMAGEN */}
      <AnimatePresence>
        {modalImage && <ImageModal image={modalImage} onClose={() => setModalImage(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TARJETA DE ARTÍCULO
   ───────────────────────────────────────────────────────────────── */
function OrderItemCard({ item, isReviewing, onOpenImage, onAdjustedImageUpdate }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const images = [
    item.user_image && { url: item.user_image, label: 'Imagen del cliente' },
    item.final_design && { url: item.final_design, label: 'Diseño final' },
    item.product_image && { url: item.product_image, label: 'Imagen del producto' },
  ].filter(Boolean);

  const handleAdjustedUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/admin/orders/${item.order_product_id}/adjusted-image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onAdjustedImageUpdate(item.order_product_id, data.url);
    } catch (err) {
      console.error('[AdminOrderDetail] Error subiendo diseño ajustado:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <div className={styles.itemInfo}>
          <div className={styles.itemNameRow}>
            <h3 className={styles.itemName}>{item.product_name || 'Producto sin nombre'}</h3>
            {/* Badge comunidad vs público/privado */}
            {item.community ? (
              <span className={styles.badgeCommunity}><FaUsers /> COMUNIDAD</span>
            ) : (
              <span className={item.is_public ? styles.badgePublic : styles.badgePrivate}>
                {item.is_public ? <><FaUnlock /> PÚBLICO</> : <><FaLock /> PRIVADO</>}
              </span>
            )}
          </div>
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

      {item.customer_note && (
        <div className={styles.itemNote}>
          <FaCircleExclamation />
          <p>{item.customer_note}</p>
        </div>
      )}

      <div className={styles.imagesContainer}>
        {/* Imágenes normales */}
        <div className={styles.imagesGrid}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <span className={styles.imageLabel}>{img.label}</span>
              <button className={styles.imageBtn} onClick={() => onOpenImage(img)}>
                <img src={img.url} alt={img.label} className={styles.itemImage} />
              </button>
            </div>
          ))}
        </div>

        {/* Diseño ajustado separado — solo visible si hay imagen o estamos en 'revisando' */}
        {(item.adjusted_image || isReviewing) && (
          <div className={styles.adjustedSection}>
            <div className={styles.imageWrapper}>
              <span className={styles.imageLabel}>Diseño ajustado</span>
              {item.adjusted_image ? (
                <button className={styles.imageBtn} onClick={() => onOpenImage({ url: item.adjusted_image, label: 'Diseño ajustado' })}>
                  <img src={item.adjusted_image} alt="Diseño ajustado" className={styles.itemImage} />
                </button>
              ) : isReviewing ? (
                <>
                  <button className={styles.adjustedUploadBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? <FaSpinner className={styles.spinIcon} /> : <><FaArrowUpFromBracket /> AÑADIR DISEÑO</>}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleAdjustedUpload} />
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TARJETA DE CONTACTO
   ───────────────────────────────────────────────────────────────── */
function UserContactCard({ user }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}><FaCircleUser /> Cliente</h3>
      <div className={styles.userContact}>
        <div className={styles.userContactAvatar}>
          {user.profile_image ? <img src={user.profile_image} alt={user.nickname} /> : <FaCircleUser size={36} />}
        </div>
        <div className={styles.userContactInfo}>
          <span className={styles.userContactName}>{user.nickname || '—'}</span>
          <a href={`mailto:${user.email}`} className={styles.userContactEmail}><FaEnvelope /> {user.email}</a>
        </div>
      </div>
      <Link href="/dashboard/admin/usuarios" className={styles.chatLink}>
        <FaComment /> IR AL CHAT
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TARJETA DE PRECIO
   ───────────────────────────────────────────────────────────────── */
function PriceCard({ orderId, totalAmount, isPendingApproval, discountCode, discountType, discountValue, onPriceUpdate }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = () => { setValue(parseFloat(totalAmount || 0).toFixed(2)); setEditing(true); setError(''); };
  const handleCancel = () => { setEditing(false); setError(''); };

  const handleSave = async () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) { setError('Introduce un precio válido'); return; }
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
    } catch { setError('Error al guardar el precio'); }
    finally { setSaving(false); }
  };

  // Formateamos el descuento según su tipo
  const discountDisplay = discountCode
    ? discountType === 'percentage'
      ? `-${parseFloat(discountValue).toFixed(0)}%`
      : `-${parseFloat(discountValue).toFixed(2)}€`
    : '0.00€';

  return (
    <div className={`${styles.card} ${isPendingApproval ? styles.cardHighlight : ''}`}>
      <h3 className={styles.cardTitle}>
        <FaFileInvoiceDollar />
        {isPendingApproval ? 'Fijar precio del pedido' : 'Precio del pedido'}
      </h3>

      {editing ? (
        <div className={styles.priceEditWrapper}>
          <div className={styles.priceInputRow}>
            <input type="number" min="0" step="0.01" value={value} onChange={e => setValue(e.target.value)} className={styles.priceInput} autoFocus />
            <span className={styles.priceCurrency}>€</span>
          </div>
          {error && <p className={styles.priceError}>{error}</p>}
          <div className={styles.priceEditActions}>
            <button className={styles.priceCancel} onClick={handleCancel} disabled={saving}><FaXmark /> Cancelar</button>
            <button className={styles.priceSave} onClick={handleSave} disabled={saving}>
              {saving ? <FaSpinner className={styles.spinIcon} /> : <FaCheck />} Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.priceDisplay}>
          <span className={styles.priceAmount}>{parseFloat(totalAmount || 0).toFixed(2)}€</span>
          {isPendingApproval && (
            <button className={styles.priceEditBtn} onClick={handleEdit}><FaPenToSquare /> Editar precio</button>
          )}
        </div>
      )}

      <div className={styles.priceSummaryRows}>
        <div className={styles.priceSummaryRow}>
          <span>Envío</span>
          <span className={styles.free}>GRATIS</span>
        </div>

        {/* Fila de descuento: siempre visible, 0.00€ si no hay código */}
        <div className={styles.priceSummaryRow}>
          <span className={styles.discountLabel}>
            <FaTag />
            {discountCode
              ? <span className={styles.discountCode}>{discountCode}</span>
              : 'Descuento'
            }
          </span>
          <span className={discountCode ? styles.discountValue : styles.discountEmpty}>
            {discountDisplay}
          </span>
        </div>

        <div className={`${styles.priceSummaryRow} ${styles.priceTotalRow}`}>
          <span>Total</span>
          <span>{parseFloat(totalAmount || 0).toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
  
}
