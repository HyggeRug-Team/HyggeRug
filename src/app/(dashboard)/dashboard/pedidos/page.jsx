/**
 * @file pedidos/page.jsx
 * @description Vista del historial de pedidos del usuario con estados dinámicos.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado esta página para que el usuario tenga total visibilidad de sus alfombras, 
 * desde que se diseñan hasta que se entregan, usando una interfaz Neo-Brutalista.
 * 
 * [Por qué lo hemos hecho así]
 * Un historial rico en detalles (imágenes, fechas, precios desglosados) transmite confianza 
 * y reduce la ansiedad del cliente sobre el estado de su inversión personalizada.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/lib/db/orders";
import styles from "./pedidos.module.css";
import React from 'react';
import Link from "next/link";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/ui/Buttons/SecondaryButton/SecondaryButton";
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import { 
  FaCircleCheck, 
  FaTruckFast, 
  FaSpinner, 
  FaPalette, 
  FaFileInvoiceDollar, 
  FaCalendarDays, 
  FaStore,
  FaBoxOpen,
  FaChevronRight
} from "react-icons/fa6";

export const metadata = {
  title: "Mis Pedidos | Hygge Rug",
  description: "Historial de pedidos",
};

export default async function PedidosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const userId = session.user_id || session.id;
  let orders = [];

  try {
      orders = await getOrdersByUser(userId);
  } catch (err) {
      console.error("Error cargando pedidos:", err);
  }

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'diseñando':
        return { icon: <FaPalette />, text: 'DISEÑANDO', class: styles.statusDesigning };
      case 'comprobando pago':
      case 'pendiente de aprobación':
        return { icon: <FaSpinner className={styles.spinIcon} />, text: 'PROCESANDO', class: styles.statusProcessing };
      case 'tejiendo':
        return { icon: <FaPalette />, text: 'EN TALLER (TEJIENDO)', class: styles.statusTufting };
      case 'enviado':
        return { icon: <FaTruckFast />, text: 'ENVIADO', class: styles.statusShipped };
      case 'recibido':
        return { icon: <FaCircleCheck />, text: 'ENTREGADO', class: styles.statusDelivered };
      default:
        return { icon: <FaSpinner />, text: status.toUpperCase(), class: styles.statusDefault };
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* ========== HEADER (Coherente con Resumen) ========== */}
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
            <h1>Tus Pedidos</h1>
            <p>Rastrea tus creaciones desde el taller hasta tu setup.</p>
        </div>
        
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>
      
      <main className={styles.mainContentGrid}>
        <div className={styles.ordersFullWidth}>
            {orders.length === 0 ? (
               <div className={styles.emptyStateCard}>
                 <div className={styles.emptyIcon}>
                    <FaBoxOpen size={80} color="var(--grey-600)" />
                 </div>
                 <h3 className={styles.emptyTitle}>NINGUNA ENTRADA REGISTRADA</h3>
                 <p className={styles.emptyText}>Todavía no has realizado ningún pedido en nuestra tienda.</p>
                 <div style={{marginTop: '20px'}}>
                    <PrimaryButton 
                        text="IR A LA TIENDA" 
                        url="/" 
                        Icon={FaStore} 
                    />
                 </div>
               </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.order_status);
                  const orderDate = new Date(order.creation_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

                  return (
                    <div key={order.order_id} className={styles.orderCard}>
                      <div className={styles.cardHeader}>
                         <div className={styles.orderIdGroup}>
                            <span className={styles.orderLabel}>ORDEN</span>
                            <span className={styles.orderNumber}>#{order.order_id}</span>
                         </div>
                         <div className={`${styles.statusBadge} ${statusInfo.class}`}>
                            {statusInfo.icon}
                            <span>{statusInfo.text}</span>
                         </div>
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.orderGridInfo}>
                            <div className={styles.metaColumn}>
                                <div className={styles.detailRow}>
                                    <FaCalendarDays className={styles.detailIcon}/>
                                    <span>Comprado el <strong className={styles.strongText}>{orderDate}</strong></span>
                                </div>
                                <div className={styles.detailRow}>
                                    <FaFileInvoiceDollar className={styles.detailIcon}/>
                                    <span>Total pagado: <strong className={styles.strongText}>{parseFloat(order.total_amount).toFixed(2)}€</strong></span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.paymentMethodLabel}>{order.payment_method || 'Tarjeta'}</span>
                                </div>
                            </div>

                            <div className={styles.itemsWrapper}>
                                <p className={styles.itemsTitle}>ARTÍCULOS EN ESTA ORDEN:</p>
                                <div className={styles.itemsListContainer}>
                                {order.items && order.items.map((item, idx) => (
                                    <div key={idx} className={styles.itemRow}>
                                    <div className={styles.itemIconBox}>
                                        <img src={item.user_image || '/placeholder-rug.png'} alt="Miniatura" className={styles.itemThumb} />
                                    </div>
                                    <div className={styles.itemMeta}>
                                        <span className={styles.itemName}>Alfombra Custom - {item.product_size ?? 'A Medida'}</span>
                                        <span className={styles.itemQtyText}>CANTIDAD: {item.quantity}</span>
                                    </div>
                                    <div className={styles.itemPrice}>
                                        {parseFloat(item.price).toFixed(2)}€
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
