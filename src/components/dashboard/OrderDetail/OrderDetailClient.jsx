/**
 * @file OrderDetailClient.jsx
 * @description Componente de cliente para la vista detallada de un pedido.
 * 
 * [Nuestro enfoque]
 * No todos los dispositivos son iguales, y un pedido de Hygge Rug merece verse bien en todos. 
 * Hemos separado la lógica visual en dos mundos: uno para escritorio (más estructurado y 
 * con un tracker horizontal superior) y otro para dispositivos táctiles (con una barra 
 * de estado fija que acompaña al usuario).
 * 
 * [Por qué lo hemos hecho así]
 * Un pedido puede ser largo y tener muchos artículos. En móvil, si el tracker está arriba, 
 * el usuario lo pierde de vista al hacer scroll. Con la "Floating Pill" inferior, el estado 
 * siempre está a un pulgar de distancia. En escritorio, aprovechamos el ancho para mostrar 
 * el progreso de forma lineal y clara.
 */
"use client";

import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import styles from "./OrderDetail.module.css";
import Link from "next/link";
import { 
  FaChevronLeft, 
  FaPalette, 
  FaSpinner, 
  FaTruckFast, 
  FaCircleCheck,
  FaLocationDot,
  FaFileInvoiceDollar,
  FaCalendarDays,
  FaCreditCard,
  FaPhone
} from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import CopyButton from "@/components/ui/Buttons/CopyButton/CopyButton";

export default function OrderDetailClient({ order, config }) {
  // Detectamos si es un dispositivo táctil para cambiar el layout por completo
  const isTouch = useIsTouchDevice();

  /**
   * Mapeamos el estado del pedido a iconos y colores específicos.
   * Esto ayuda a que el usuario identifique visualmente en qué fase está su alfombra.
   */
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'diseñando':
        return { icon: <FaPalette />, text: 'DISEÑANDO', class: styles.statusDesigning, step: 1 };
      case 'pendiente de aprobación':
        return { icon: <FaSpinner className={styles.spinIcon} />, text: 'REVISANDO', class: styles.statusProcessing, step: 2 };
      case 'comprobando pago':
        return { icon: <MdOutlinePayments />, text: 'PAGO PENDIENTE', class: styles.statusShipped, step: 3 };
      case 'tejiendo':
        return { icon: <FaPalette />, text: 'EN TALLER', class: styles.statusTufting, step: 4 };
      case 'enviado':
        return { icon: <FaTruckFast />, text: 'ENVIADO', class: styles.statusShipped, step: 5 };
      case 'recibido':
        return { icon: <FaCircleCheck />, text: 'ENTREGADO', class: styles.statusDelivered, step: 6 };
      default:
        return { icon: <FaSpinner />, text: status.toUpperCase(), class: styles.statusDefault, step: 1 };
    }
  };

  const statusInfo = getStatusInfo(order.order_status);
  
  // Formateamos la fecha para que sea legible y humana
  const orderDate = new Date(order.creation_date).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Definimos los pasos del proceso artesanal de Hygge Rug
  const steps = [
    { id: 1, label: 'Diseñando', icon: <FaPalette size={14} /> },
    { id: 2, label: 'Revisando', icon: <FaSpinner size={14} /> },
    { id: 3, label: 'Pago', icon: <MdOutlinePayments size={14} /> },
    { id: 4, label: 'En taller', icon: <FaPalette size={14} /> },
    { id: 5, label: 'Enviado', icon: <FaTruckFast size={14} /> },
    { id: 6, label: 'Entregado', icon: <FaCircleCheck size={14} /> },
  ];

  /* ─────────────────────────────────────────────────────────────────────────────
     VISTA TÁCTIL (Móvil / Tablet)
     Priorizamos la comodidad del pulgar y el acceso rápido a la información crítica.
     ───────────────────────────────────────────────────────────────────────────── */
  if (isTouch) {
    return (
      <div className={styles.touchDetailContainer}>
        {/* Cabecera compacta con el número de pedido resaltado */}
        <header className={styles.touchHeader}>
          <Link href="/dashboard/pedidos" className={styles.touchBackButton}>
            <FaChevronLeft /> VOLVER AL HISTORIAL
          </Link>
          <div className={styles.touchHeaderInfo}>
            <h1 className={styles.touchTitle}>
              Pedido <span className={styles.touchOrderID}>#{order.order_id}</span>
            </h1>
          </div>
        </header>

        <main>
          {/* Listado de artículos: Lo primero que el usuario quiere ver */}
          <section className={styles.touchItemsSection}>
            <h2 className={styles.touchCardTitle}>
               <span className={styles.touchSectionTitleIndicator}></span>
               Artículos en el pedido
            </h2>
            <div className={styles.touchItemsList}>
              {order.items.map((item, idx) => (
                <div key={idx} className={styles.touchItemCard}>
                  <div className={styles.touchItemImage}>
                    <img src={item.image_url || '/placeholder-rug.png'} alt={item.product_name} />
                  </div>
                  <div className={styles.touchItemDetails}>
                    <h3>{item.product_name || 'Alfombra Custom'}</h3>
                    <div className={styles.touchItemMeta}>
                      <span>x{item.quantity} • {parseFloat(item.price || 0).toFixed(2)}€</span>
                    </div>
                  </div>
                  <div className={styles.touchItemTotal}>
                    {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Banner de acción: Si hay que pagar, se lo recordamos aquí con estilo */}
          {order.order_status.toLowerCase() === 'comprobando pago' && (
            <div className={`${styles.actionBanner} ${styles.touchActionBanner}`}>
              <div className={styles.actionBannerContent}>
                <h2 className={`${styles.actionBannerTitle} ${styles.touchActionBannerTitle}`}>Pago pendiente</h2>
                <p className={`${styles.actionBannerText} ${styles.touchActionBannerText}`}>
                  Realiza el pago para que podamos ponernos manos a la obra con tu pedido.
                </p>
                <div className={styles.touchActionMethods}>
                  <div className={`${styles.paymentMethodCard} ${styles.touchPaymentCard}`}>
                    <span className={styles.paymentMethodLabel}>Bizum</span>
                    <CopyButton value={config.bizum_phone} label={config.bizum_phone} className={`${styles.paymentMethodValue} ${styles.touchPaymentValueBizum}`} />
                  </div>
                </div>
                <div className={`${styles.paymentMethodCard} ${styles.touchPaymentCard}`}>
                    <span className={styles.paymentMethodLabel}>IBAN de transferencia</span>
                    <CopyButton value={config.bank_account} label="Copiar IBAN" className={`${styles.paymentMethodValue} ${styles.touchPaymentValueIBAN}`} />
                </div>
              </div>
            </div>
          )}

          {/* Detalles secundarios: Dirección y Resumen Económico */}
          <div className={styles.touchSidebar}>
            <div className={styles.touchCard}>
              <h3 className={styles.touchCardTitle}><FaLocationDot /> Dirección</h3>
              {order.address ? (
                <div className={styles.touchAddress}>
                  <p><strong>{order.address.ciudad} ({order.address.provincia})</strong></p>
                  <p>{order.address.calle}, {order.address.portal_piso_puerta}</p>
                  <p>{order.address.codigo_postal}</p>
                </div>
              ) : (
                <p className={styles.emptyText}>No hemos encontrado dirección de envío.</p>
              )}
            </div>

            <div className={styles.touchCard}>
              <h3 className={styles.touchCardTitle}><FaFileInvoiceDollar /> Resumen del Pago</h3>
              <div className={styles.touchSummaryRow}>
                <span>Subtotal</span>
                <span>{parseFloat(order.total_amount || 0).toFixed(2)}€</span>
              </div>
              <div className={styles.touchSummaryRow}>
                <span>Envío</span>
                <span className={styles.free}>GRATIS</span>
              </div>
              <div className={`${styles.touchSummaryRow} ${styles.touchTotalRow}`}>
                <span>Total</span>
                <span>{parseFloat(order.total_amount || 0).toFixed(2)}€</span>
              </div>
            </div>

            <div className={styles.touchOrderMeta}>
              <FaCalendarDays /> Pedido realizado el {orderDate}
            </div>
          </div>
        </main>

        {/* 
            BARRA DE ESTADO INFERIOR (Floating Status)
            Para que el usuario no tenga que buscar el estado, lo fijamos abajo.
            Es interactivo y visualmente muy potente.
        */}
        <div className={styles.bottomStatusBar}>
          <div className={styles.bottomStatusHeader}>
            <div className={styles.bottomStatusInfo}>
              <div className={styles.bottomStatusIcon}>
                {statusInfo.icon}
              </div>
              <div className={styles.bottomStatusText}>
                <span className={styles.bottomStatusLabel}>Estado del pedido</span>
                <span className={styles.bottomStatusValue}>{statusInfo.text}</span>
              </div>
            </div>
            <div className={styles.stepBadge}>
               Paso {statusInfo.step} de 6
            </div>
          </div>

          {/* Tracker horizontal compacto dentro de la barra flotante */}
          <div className={styles.horizontalTracker}>
            <div className={styles.horizontalLine}>
              <div 
                className={styles.horizontalProgress} 
                style={{ width: `${((statusInfo.step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`${styles.miniStepWrapper} ${statusInfo.step >= step.id ? styles.miniStepActive : ''}`}
              >
                <div className={styles.miniStepDot}>
                  {statusInfo.step > step.id 
                    ? <FaCircleCheck size={12} /> 
                    : statusInfo.step === step.id 
                      ? step.icon 
                      : step.id
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     VISTA ESCRITORIO (Desktop View)
     Aprovechamos el espacio horizontal para una estructura de "Panel de Control".
     ───────────────────────────────────────────────────────────────────────────── */
  return (
    <div className={styles.detailContainer}>
      {/* Cabecera: Botón de volver a la izquierda y estado a la derecha */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/dashboard/pedidos" className={styles.backButton}>
            <FaChevronLeft /> VOLVER AL HISTORIAL
          </Link>
          <h1>Pedido #{order.order_id}</h1>
        </div>
        <div className={`${styles.statusBadge} ${statusInfo.class}`}>
          {statusInfo.icon} {statusInfo.text}
        </div>
      </header>

      {/* 1. TRACKER HORIZONTAL SUPERIOR: La primera parada visual del usuario */}
      <section className={styles.desktopTrackerCard}>
        <div className={styles.desktopTrackerWrapper}>
          <div className={styles.desktopTrackerLine}>
            <div 
              className={styles.desktopTrackerProgress} 
              style={{ width: `${((statusInfo.step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`${styles.desktopStep} ${statusInfo.step >= step.id ? styles.desktopStepActive : ''}`}
            >
              <div className={styles.desktopStepDot}>
                {statusInfo.step > step.id 
                  ? <FaCircleCheck size={20} /> 
                  : statusInfo.step === step.id 
                    ? step.icon 
                    : step.id
                }
              </div>
              <span className={styles.desktopStepLabel}>{step.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. AVISO DE PAGO: Solo si el pedido está esperando el dinero */}
      {order.order_status.toLowerCase() === 'comprobando pago' && (
        <div className={styles.actionBanner}>
          <div className={styles.actionBannerIcon}>
            <MdOutlinePayments size={32} />
          </div>
          <div className={styles.actionBannerContent}>
            <h2 className={styles.actionBannerTitle}>Acción requerida: Completa tu pago</h2>
            <p className={styles.actionBannerText}>
              Para agilizar el proceso, usa este concepto: <CopyButton value={`Pago #${order.order_id}`} className={styles.conceptHighlight} />
            </p>
            <div className={styles.actionBannerMethods}>
              <div className={styles.paymentMethodCard}>
                <span className={styles.paymentMethodLabel}>Bizum</span>
                <CopyButton value={config.bizum_phone} label={config.bizum_phone} className={styles.paymentMethodValue} />
              </div>
              <div className={styles.paymentMethodCard}>
                <span className={styles.paymentMethodLabel}>Transferencia (IBAN)</span>
                <CopyButton value={config.bank_account} label="Copiar IBAN" className={styles.paymentMethodValue} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRID DE CONTENIDO: Artículos a la izquierda, Info de envío a la derecha */}
      <main className={styles.grid}>
        <section className={styles.itemsSection}>
          <h2 className={styles.sectionTitle}>Artículos en este pedido</h2>
          <div className={styles.itemsList}>
            {order.items.map((item, idx) => (
              <div key={idx} className={styles.itemCard}>
                <div className={styles.itemImage}>
                  <img src={item.image_url || '/placeholder-rug.png'} alt={item.product_name} />
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.product_name || 'Alfombra Custom'}</h3>
                  <div className={styles.itemMeta}>
                    <span>Cantidad: {item.quantity}</span>
                    <span>Precio unitario: {parseFloat(item.price || 0).toFixed(2)}€</span>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}€
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          {/* Tarjeta de Dirección */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FaLocationDot /> Dirección de envío</h3>
            {order.address ? (
              <div className={styles.addressInfo}>
                <p className={styles.addressCity}>{order.address.ciudad} ({order.address.provincia})</p>
                <p>{order.address.calle} {order.address.portal_piso_puerta}</p>
                <p>{order.address.codigo_postal}</p>
                {order.address.phone_number && (
                  <p className={styles.phone}><FaPhone size={12} /> {order.address.phone_number}</p>
                )}
              </div>
            ) : (
              <p className={styles.emptyText}>No hay dirección asociada.</p>
            )}
          </div>

          {/* Tarjeta de Pago y Resumen */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FaFileInvoiceDollar /> Resumen de pago</h3>
            <div className={styles.paymentSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{parseFloat(order.total_amount || 0).toFixed(2)}€</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span className={styles.free}>GRATIS</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{parseFloat(order.total_amount || 0).toFixed(2)}€</span>
              </div>
              <div className={styles.paymentMethod}>
                <FaCreditCard /> {order.payment_method || 'Tarjeta bancaria'}
              </div>
            </div>
          </div>

          <div className={styles.orderMeta}>
            <FaCalendarDays /> Pedido realizado el {orderDate}
          </div>
        </aside>
      </main>
    </div>
  );
}
