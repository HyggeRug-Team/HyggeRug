/**
 * @file resumen/page.jsx
 * @description Panel principal de bienvenida y resumen de actividad del usuario.
 * 
 * [Nuestro enfoque]
 * Esta página es el "Home" del panel privado, mostrando de un vistazo el clima, 
 * los pedidos recientes y la información de contacto rápida.
 * 
 * [Por qué lo hemos hecho así]
 * Mantener esta vista simple y visual (con widgets y tarjetas de stats) permite al 
 * usuario sentirse en control de su cuenta nada más entrar, facilitando el acceso 
 * a la tienda o sus direcciones.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "./resumen.module.css";
import Link from "next/link";
import StatsCards from "@/components/ui/Cards/StatsCard/StatsCard";
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget"; 
import { getOrdersByUser } from "@/lib/db/orders";
import { getDefaultAddress } from "@/lib/db/addresses";
import { 
  FaCubes, 
  FaHeart, 
  FaStar, 
  FaBoxOpen, 
  FaTruckFast, 
  FaLocationDot, 
  FaCreditCard, 
  FaChevronRight,
  FaStore
} from "react-icons/fa6";

export const metadata = {
  title: "Resumen | Hygge Rug",
  description: "Panel de control de tu cuenta",
};

export default async function ResumenPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const userId = session.user_id || session.id;

  // Lógica de BBDD
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
  
  // Cálculo de Puntos Hygge: 10 puntos por cada 1€ gastado
  const totalSpent = orders ? orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) : 0;
  const hyggePoints = Math.floor(totalSpent * 10);

  // Recortamos a los últimos 3 pedidos para el dashboard
  const recentOrders = orders ? orders.slice(0, 3) : [];

  return (
    <div className={styles.dashboardContainer}>
      
      {/* ========== HEADER CON CLIMA REAL ========== */}
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
          <h1>Hola, {session.nickname || 'Amigo'}</h1>
          <p>Bienvenido a tu panel de control.</p>
        </div>
        
        <div className={styles.headerWidgets}>
          <Link href="/" className={styles.viewAllLink}>
            <FaStore style={{marginRight: '8px'}} /> Ir a la Tienda
          </Link>
          <WeatherWidget />
        </div>
      </header>


      {/* ========== ESTADÍSTICAS CLAVE ========== */}
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
          bigText={hyggePoints.toLocaleString()}
          smallText="Puntos Hygge"
          color="var(--hover-text)"
          Icon={FaStar}
        />
      </section>

      {/* ========== CONTENIDO PRINCIPAL DIVIDIDO ========== */}
      <div className={styles.mainContentGrid}>
        
        {/* --- COLUMNA IZQUIERDA: PEDIDOS RECIENTES --- */}
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
                  let statusBadgeClass = styles.statusProcessing;
                  let icon = <FaBoxOpen />;
                  
                  if (order.order_status === 'enviado') {
                      statusBadgeClass = styles.statusShipped;
                      icon = <FaTruckFast />;
                  } else if (order.order_status === 'recibido') {
                      statusBadgeClass = styles.statusDelivered;
                      icon = <FaBoxOpen />;
                  }

                  const formatItemName = order.items && order.items.length > 0 
                      ? `${order.items[0].product_size || 'Alfombra Custom'}`
                      : 'Pedido de Tienda';

                  const qtyText = order.items && order.items.length > 1 
                      ? ` y ${order.items.length - 1} artículo(s) más` 
                      : '';

                  return (
                      <div key={order.order_id} className={`${styles.orderItem} ${statusBadgeClass}`}>
                        <div className={styles.orderInfoMain}>
                          <div className={styles.orderIcon}>
                            {icon}
                          </div>
                          <div className={styles.orderText}>
                            <h4>Pedido #{order.order_id}</h4>
                            <p>{formatItemName}{qtyText}</p>
                          </div>
                        </div>
                        <div className={styles.orderStatus}>
                          <span className={styles.statusBadge}>{order.order_status.toUpperCase()}</span>
                          <span className={styles.orderDate}>{parseFloat(order.total_amount).toFixed(2)}€</span>
                        </div>
                      </div>
                  );
              })}
            </div>
          ) : (
            <div 
              style={{
                width: '100%',
                padding: '40px 20px',
                background: 'rgba(5, 5, 5, 0.4)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: '10px'
              }}
            >
              <FaBoxOpen style={{ fontSize: '3rem', color: 'var(--grey-800)', marginBottom: '15px' }} />
              <h3 style={{ 
                fontFamily: 'var(--font-body)', 
                fontWeight: 800, 
                color: 'var(--grey-500)', 
                letterSpacing: '1px', 
                textTransform: 'uppercase', 
                fontSize: '1rem', 
                margin: 0 
              }}>
                No tienes pedidos recientes
              </h3>
            </div>
          )}
        </section>

        {/* --- COLUMNA DERECHA: DATOS DE CUENTA --- */}
        <aside className={styles.accountSummary}>
          
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBadge} ${styles.addressBadge}`}>
                <FaLocationDot />
              </div>
              <div>
                <h3>Dirección Principal</h3>
                <span className={styles.cardSubtitle}>Envíos predeterminados</span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              {defaultAddress ? (
                  <div className={styles.addressBlock}>
                    <p className={styles.addressTitle}>{defaultAddress.ciudad} ({defaultAddress.provincia})</p>
                    <p className={styles.addressLine}>{defaultAddress.calle} {defaultAddress.portal_piso_puerta}</p>
                    <p className={styles.addressLine}>{defaultAddress.codigo_postal}, {defaultAddress.pais}</p>
                  </div>
              ) : (
                  <div className={styles.addressBlock}>
                      <p className={styles.addressLine}>No tienes direcciones asociadas aún.</p>
                  </div>
              )}
              
              <Link href="/dashboard/direcciones" className={styles.editLink}>
                Gestionar direcciones <FaChevronRight size={10} />
              </Link>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBadge} ${styles.paymentBadge}`}>
                <FaCreditCard />
              </div>
              <div>
                <h3>Método de Pago</h3>
                <span className={styles.cardSubtitle}>Tarjetas vinculadas guardadas</span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.creditCardMini}>
                  <p style={{fontSize: '0.85rem', color: '#888'}}>Los datos de pago no se guardan de forma local. En tu próximo pago el navegador autocompletará la tarjeta segura.</p>
              </div>
              
              <Link href="/dashboard/pagos" className={styles.editLink}>
                Soporte de pagos <FaChevronRight size={10} />
              </Link>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}

