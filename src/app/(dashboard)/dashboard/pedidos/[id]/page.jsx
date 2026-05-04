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

  const order = await getOrderById(id);

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
        return { icon: <FaPalette />, text: 'DISEÑANDO', class: styles.statusDesigning, step: 1 };
      case 'comprobando pago':
      case 'pendiente de aprobación':
        return { icon: <FaSpinner className={styles.spinIcon} />, text: 'PROCESANDO', class: styles.statusProcessing, step: 2 };
      case 'tejiendo':
        return { icon: <FaPalette />, text: 'EN TALLER', class: styles.statusTufting, step: 3 };
      case 'enviado':
        return { icon: <FaTruckFast />, text: 'ENVIADO', class: styles.statusShipped, step: 4 };
      case 'recibido':
        return { icon: <FaCircleCheck />, text: 'ENTREGADO', class: styles.statusDelivered, step: 5 };
      default:
        return { icon: <FaSpinner />, text: status.toUpperCase(), class: styles.statusDefault, step: 1 };
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
    { id: 1, label: 'Diseño' },
    { id: 2, label: 'Pago' },
    { id: 3, label: 'Taller' },
    { id: 4, label: 'Envío' },
    { id: 5, label: 'Listo' }
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
                      {statusInfo.step > step.id ? <FaCircleCheck size={14} /> : step.id}
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
                  <p className={styles.phone}><FaPhone size={12}/> {order.address.phone_number}</p>
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
