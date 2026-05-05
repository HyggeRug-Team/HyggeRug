/**
 * @file pedidos/[id]/page.jsx
 * @description Vista detallada de un pedido específico.
 * 
 * [Nuestro enfoque]
 * Esta página es la culminación de la transparencia en la compra. Mostramos cada detalle 
 * técnico (dirección, desglose de precios, artículos) y un rastreador visual vertical que 
 * guía al usuario a través del ciclo de vida artesanal de su producto.
 * 
 * [Por qué lo hemos hecho así]
 * Para productos personalizados de alto valor emocional como una alfombra Tufting, 
 * la información detallada es clave. Al centralizar todo en una vista limpia y organizada, 
 * generamos una sensación de seguridad y profesionalidad inigualable.
 */
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrderById } from "@/lib/db/orders";
import styles from "./orderDetail.module.css";
import Link from "next/link";
import CopyButton from "@/components/ui/Buttons/CopyButton/CopyButton";
import { MdOutlinePayments } from "react-icons/md";
import { getConfigValues } from "@/lib/db/config";
import {
  FaChevronLeft,
  FaCalendarDays,
  FaCreditCard,
  FaLocationDot,
  FaBoxOpen,
  FaCircleCheck,
  FaTruckFast,
  FaSpinner,
  FaPalette,
  FaFileInvoiceDollar,
  FaPhone
} from "react-icons/fa6";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Pedido #${id} | Hygge Rug`,
    description: `Detalles del pedido #${id}`,
  };
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const [order, config] = await Promise.all([
    getOrderById(id),
    getConfigValues(["bizum_phone", "bank_account"])
  ]);

  if (!order) {
    return (
      <div className={styles.errorContainer}>
        <FaBoxOpen size={80} color="var(--grey-600)" />
        <h1>Pedido no encontrado</h1>
        <p>No pudimos encontrar la información del pedido solicitado.</p>
        <Link href="/dashboard/pedidos" className={styles.backLink}>
          Volver al historial
        </Link>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'diseñando':
        return { icon: <FaPalette />, text: 'DISEÑANDO', class: styles.statusDesigning, step: 1, type: 'en curso' };
      case 'pendiente de aprobación':
        return { icon: <FaSpinner className={styles.spinIcon} />, text: 'REVISANDO', class: styles.statusProcessing, step: 2, type: 'en curso' };
      case 'comprobando pago':
        return { icon: <MdOutlinePayments />, text: 'PAGO PENDIENTE', class: styles.statusShipped, step: 3, type: 'en curso' };
      case 'tejiendo':
        return { icon: <FaPalette />, text: 'EN TALLER', class: styles.statusTufting, step: 4, type: 'en curso' };
      case 'enviado':
        return { icon: <FaTruckFast />, text: 'ENVIADO', class: styles.statusShipped, step: 5, type: 'en curso' };
      case 'recibido':
        return { icon: <FaCircleCheck />, text: 'ENTREGADO', class: styles.statusDelivered, step: 6, type: 'entregados' };
      default:
        return { icon: <FaSpinner />, text: status.toUpperCase(), class: styles.statusDefault, step: 1, type: 'en curso' };
    }
  };

  const statusInfo = getStatusInfo(order.order_status);
  const orderDate = new Date(order.creation_date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const steps = [
    { id: 1, label: 'Diseñando', icon: <FaPalette size={14} /> },
    { id: 2, label: 'Revisando', icon: <FaSpinner size={14} /> },
    { id: 3, label: 'Pago', icon: <MdOutlinePayments size={14} /> },
    { id: 4, label: 'En taller', icon: <FaPalette size={14} /> },
    { id: 5, label: 'Enviado', icon: <FaTruckFast size={14} /> },
    { id: 6, label: 'Entregado', icon: <FaCircleCheck size={14} /> },
  ];

  return (
    <div className={styles.detailContainer}>
      <header className={styles.header}>
        <Link href="/dashboard/pedidos" className={styles.backButton}>
          <FaChevronLeft /> Volver
        </Link>
        <div className={styles.headerInfo}>
          <h1>Pedido #{order.order_id}</h1>
          <div className={`${styles.statusBadge} ${statusInfo.class}`}>
            {statusInfo.icon} {statusInfo.text}
          </div>
        </div>
      </header>
      {/* INSTRUCCIONES DE ACCIÓN - solo visible cuando requiere acción del cliente */}
      {order.order_status.toLowerCase() === 'comprobando pago' && (
        <div className={styles.actionBanner}>
          <div className={styles.actionBannerIcon}>
            <MdOutlinePayments size={32} />
          </div>
          <div className={styles.actionBannerContent}>
            <h2 className={styles.actionBannerTitle}>Acción requerida: Completa tu pago</h2>
            <p className={styles.actionBannerText}>
              Para continuar con tu pedido, realiza el pago por <strong>Bizum</strong> o <strong>transferencia bancaria </strong>
              con el concepto exacto:  <CopyButton value={`Pago #${order.order_id}`} className={styles.conceptHighlight} />
            </p>
            <div className={styles.actionBannerMethods}>
              <div className={styles.paymentMethodCard}>
                <span className={styles.paymentMethodLabel}>Bizum</span>
                <CopyButton
                  value={config.bizum_phone}
                  label={config.bizum_phone?.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") || "Número no disponible"}
                  className={styles.paymentMethodValue}
                />
              </div>
              <div className={styles.paymentMethodDivider}>ó</div>
              <div className={styles.paymentMethodCard}>
                <span className={styles.paymentMethodLabel}>Transferencia</span>
                <CopyButton
                  value={config.bank_account || "Número no disponible"}
                  label={config.bank_account}
                  className={styles.paymentMethodValue}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <main className={styles.grid}>
        {/* COLUMNA IZQUIERDA: ARTÍCULOS */}
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

        {/* COLUMNA DERECHA: RESUMEN Y ESTADO */}
        <aside className={styles.sidebar}>

          {/* TRACKER VISUAL */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Estado del pedido</h3>
            <div className={styles.trackerContainer}>
              <div className={styles.trackerLine}>
                <div
                  className={styles.trackerProgress}
                  style={{ height: `${((statusInfo.step - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
              <div className={styles.trackerSteps}>
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`${styles.stepWrapper} ${statusInfo.step >= step.id ? styles.stepActive : ''}`}
                  >
                    <div className={styles.stepDot}>
                      {/* Completado: check | Actual: icono del estado | Pendiente: número */}
                      {statusInfo.step > step.id
                        ? <FaCircleCheck size={14} />
                        : statusInfo.step === step.id
                          ? step.icon
                          : step.id
                      }
                    </div>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* INFORMACIÓN DE ENVÍO */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FaLocationDot /> Dirección de envío</h3>
            {order.address ? (
              <div className={styles.addressInfo}>
                <p className={styles.addressCity}>{order.address.ciudad} ({order.address.provincia})</p>
                <p>{order.address.calle} {order.address.portal_piso_puerta}</p>
                <p>{order.address.codigo_postal}, {order.address.pais}</p>
                {order.address.phone_number && (
                  <p className={styles.phone}><FaPhone size={12} /> {order.address.phone_number}</p>
                )}
              </div>
            ) : (
              <p className={styles.emptyText}>No hay dirección asociada.</p>
            )}
          </div>

          {/* RESUMEN DE PAGO */}
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

          {/* FECHA */}
          <div className={styles.orderMeta}>
            <FaCalendarDays /> Realizado el {orderDate}
          </div>

        </aside>
      </main>
    </div>
  );
}
