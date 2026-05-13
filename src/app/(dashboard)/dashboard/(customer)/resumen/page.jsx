/**
 * @file resumen/page.jsx (Cliente)
 * @description Panel principal de bienvenida y resumen para el cliente final.
 * 
 * [Nuestro enfoque]
 * Esta es la "casa" del cliente. Hemos mantenido todos los widgets que ya conocía 
 * (clima, pedidos recientes, puntos) pero ahora viven en su propio espacio reservado 
 * para asegurar que nada de la parte administrativa ensucie su experiencia.
 * 
 * [Por qué lo hemos hecho así]
 * Al mover esto a una carpeta (customer), nos permite escalar las funcionalidades 
 * del cliente (como devoluciones o ayuda) de forma independiente, sabiendo que 
 * el código es 100% específico para su rol.
 */
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/lib/db/orders";
import { getDefaultAddress } from "@/lib/db/addresses";
import { getUserById } from "@/lib/db/users";
import styles from "./resumen.module.css";
import Link from "next/link";
import StatsCards from "@/components/ui/Cards/StatsCard/StatsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader/DashboardHeader";
import { 
  FaCubes, 
  FaHeart, 
  FaStar, 
  FaBoxOpen, 
  FaTruckFast, 
  FaLocationDot, 
  FaCreditCard, 
  FaChevronRight,
  FaStore,
  FaPalette,
  FaCircleCheck,
  FaSpinner
} from "react-icons/fa6";

export const metadata = {
  title: "Resumen | Hygge Rug",
  description: "Panel de control de tu cuenta",
};

export default async function ResumenPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) redirect("/auth");

  const userId = session.userId || session.user_id || session.id;
  const user = await getUserById(userId).catch(() => null);

  // Si es admin, lo mandamos a su panel
  if (user?.rol === 'admin') {
    redirect("/dashboard/admin");
  }

  // Lógica de BBDD para clientes
  let orders = [];
  let defaultAddress = null;

  try {
      orders = await getOrdersByUser(userId);
      defaultAddress = await getDefaultAddress(userId);
  } catch (err) {
      console.error("Error al cargar datos del usuario:", err);
  }

  const hasOrders = orders && orders.length > 0;
  const totalOrders = orders ? orders.length : 0;
  const totalSpent = orders ? orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) : 0;
  const hyggePoints = Math.floor(totalSpent * 10);
  const recentOrders = orders ? orders.slice(0, 3) : [];

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader 
        user={user} 
        session={session} 
        description="Este es el resumen de tu actividad en Hygge Rug."
        showCommunity={true}
      />

      <section className={styles.statsGrid}>
        <StatsCards
          bigText={totalOrders.toString()}
          smallText="Pedidos Totales"
          color="var(--button-before-hover)"
          Icon={FaCubes}
        />
        <StatsCards
          bigText="0"
          smallText="En favoritos"
          color="var(--highlight-text)"
          Icon={FaHeart}
        />
        <StatsCards
          bigText={hyggePoints.toString()}
          smallText="Puntos Hygge"
          color="var(--hover-text)"
          Icon={FaStar}
        />
      </section>

      <div className={styles.mainContentGrid}>
        <section className={styles.recentOrders}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FaBoxOpen style={{color: 'var(--highlight-text)', marginRight:'10px'}}/> 
              Pedidos Recientes
            </h2>
            {hasOrders && (
              <Link href="/dashboard/pedidos" className={styles.secondaryLink}>
                Ver historial completo <FaChevronRight size={12} />
              </Link>
            )}
          </div>

          {hasOrders ? (
            <div className={styles.ordersList}>
              {recentOrders.map((order) => {
                  const statusInfo = {
                    'diseñando': { class: styles.statusProcessing, icon: <FaPalette />, label: 'DISEÑANDO' },
                    'pendiente de aprobación': { class: styles.statusProcessing, icon: <FaSpinner className={styles.spinIcon} />, label: 'PROCESANDO' },
                    'comprobando pago': { class: styles.statusProcessing, icon: <FaSpinner className={styles.spinIcon} />, label: 'PROCESANDO' },
                    'tejiendo': { class: styles.statusProcessing, icon: <FaPalette />, label: 'EN TALLER' },
                    'enviado': { class: styles.statusShipped, icon: <FaTruckFast />, label: 'ENVIADO' },
                    'recibido': { class: styles.statusDelivered, icon: <FaCircleCheck />, label: 'RECIBIDO' },
                  }[order.order_status.toLowerCase()] || { class: styles.statusProcessing, icon: <FaBoxOpen />, label: order.order_status.toUpperCase() };

                  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                  const itemName = firstItem ? firstItem.product_name : 'Pedido Personalizado';
                  const itemImage = firstItem ? firstItem.image_url : '/placeholder-rug.png';
                  const qtyText = order.items && order.items.length > 1 ? ` (+${order.items.length - 1} más)` : '';

                  return (
                      <Link 
                        key={order.order_id} 
                        href={`/dashboard/pedidos/${order.order_id}`}
                        className={`${styles.orderItem} ${statusInfo.class}`}
                      >
                        <div className={styles.orderInfoMain}>
                          <div className={styles.orderImageThumb}><img src={itemImage} alt={itemName} /></div>
                          <div className={styles.orderText}>
                            <h4>Pedido #{order.order_id}</h4>
                            <p>{itemName}{qtyText}</p>
                          </div>
                        </div>
                        <div className={styles.orderStatus}>
                          <span className={styles.statusBadge}>{statusInfo.icon} {statusInfo.label}</span>
                          <div className={styles.orderMetaInfo}>
                            <span className={styles.orderAmount}>{parseFloat(order.total_amount || 0).toFixed(2)}€</span>
                            <span className={styles.orderDate}>{new Date(order.creation_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                          </div>
                        </div>
                      </Link>
                  );
              })}
            </div>
          ) : (
            <div className={styles.emptyOrders}>
              <FaBoxOpen className={styles.emptyIcon} />
              <h3>No tienes pedidos recientes</h3>
            </div>
          )}
        </section>

        <aside className={styles.accountSummary}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBadge} ${styles.addressBadge}`}><FaLocationDot /></div>
              <div><h3>Dirección Principal</h3><span className={styles.cardSubtitle}>Envíos predeterminados</span></div>
            </div>
            <div className={styles.cardContent}>
              {defaultAddress ? (
                  <div className={styles.addressBlock}>
                    <p className={styles.addressTitle}>{defaultAddress.ciudad} ({defaultAddress.provincia})</p>
                    <p className={styles.addressLine}>{defaultAddress.calle} {defaultAddress.portal_piso_puerta}</p>
                    <p className={styles.addressLine}>{defaultAddress.codigo_postal}, {defaultAddress.pais}</p>
                  </div>
              ) : (
                  <div className={styles.addressBlock}><p className={styles.addressLine}>No tienes direcciones asociadas aún.</p></div>
              )}
              <Link href="/dashboard/direcciones" className={styles.editLink}>Gestionar direcciones <FaChevronRight size={10} /></Link>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBadge} ${styles.paymentBadge}`}><FaCreditCard /></div>
              <div><h3>Método de Pago</h3><span className={styles.cardSubtitle}>Tarjetas vinculadas guardadas</span></div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.creditCardMini}><p style={{fontSize: '0.85rem', color: '#888'}}>Los datos de pago no se guardan de forma local. En tu próximo pago el navegador autocompletará la tarjeta segura.</p></div>
              <Link href="/dashboard/pagos" className={styles.editLink}>Soporte de pagos <FaChevronRight size={10} /></Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
