// src/app/(dashboard)/dashboard/resumen/page.jsx
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "./resumen.module.css";
import Link from "next/link";
// Importamos el Widget Real del Tiempo
import WeatherWidget from "@/components/dashboard/WeatherWidget/WeatherWidget"; 
import { 
  FaCubes, 
  FaHeart, 
  FaStar, 
  FaBoxOpen, 
  FaTruckFast, 
  FaLocationDot, 
  FaCreditCard, 
  FaChevronRight,
  FaStore // Icono de Tienda
} from "react-icons/fa6";

export const metadata = {
  title: "Resumen | Hygge Rug",
  description: "Panel de control de tu cuenta",
};

/**
 * Página Principal del Dashboard - VISTA RESUMEN (FINAL TUFTING LAYOUT)
 * 
 * Combinamos:
 * - Estilo: Tufting Craft (bordes dashed, texturas orgánicas).
 * - Layout: Dashboard Funcional (KPIs + Lista de Pedidos).
 * - Funcionalidad: Clima Real Geolocalizado.
 */
export default async function ResumenPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  // Simulamos si hay pedidos (true) o no (false) para mostrar el diseño
  // Podemos cambiar esto a false para ver el Empty State "Lienzo Vacío"
  const hasOrders = true; 

  return (
    <div className={styles.dashboardContainer}>
      
      {/* ========== HEADER CON CLIMA REAL ========== */}
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
          <h1>Hola, {session.nickname}</h1>
          <p>Bienvenido a tu panel de control.</p>
        </div>
        
        <div className={styles.headerWidgets}>
          {/* Botón Volver a la Tienda (Estilo Parche) */}
          <Link href="/" className={styles.viewAllLink}>
            <FaStore style={{marginRight: '8px'}} /> Ir a la Tienda
          </Link>
          
          {/* Widget del Tiempo (Geolocalizado) */}
          <WeatherWidget />
        </div>
      </header>


      {/* ========== ESTADÍSTICAS CLAVE (KPIs Vibrantes) ========== */}
      <section className={styles.statsGrid}>
        
        {/* Tarjeta Púrpura */}
        <div className={`${styles.statCard} ${styles.purpleCard}`}>
          <div className={styles.statInfo}>
            <h3>12</h3>
            <p>Pedidos Totales</p>
          </div>
          <div className={styles.statIconWrapper}>
            <FaCubes />
          </div>
        </div>

        {/* Tarjeta Rosa */}
        <div className={`${styles.statCard} ${styles.pinkCard}`}>
          <div className={styles.statInfo}>
            <h3>5</h3>
            <p>En Favoritos</p>
          </div>
          <div className={styles.statIconWrapper}>
            <FaHeart />
          </div>
        </div>

        {/* Tarjeta Amarilla */}
        <div className={`${styles.statCard} ${styles.yellowCard}`}>
          <div className={styles.statInfo}>
            <h3>1,250</h3>
            <p>Puntos Hygge</p>
          </div>
          <div className={styles.statIconWrapper}>
            <FaStar />
          </div>
        </div>

      </section>


      {/* ========== CONTENIDO PRINCIPAL DIVIDIDO (Layout Clásico) ========== */}
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
              
              {/* Pedido 1 - En Camino (Amarillo) */}
              <div className={`${styles.orderItem} ${styles.statusProcessing}`}>
                <div className={styles.orderInfoMain}>
                  <div className={styles.orderIcon}>
                    <FaTruckFast />
                  </div>
                  <div className={styles.orderText}>
                    <h4>Pedido #123456</h4>
                    <p>Alfombra "Tufting Dreams" (Rosa)</p>
                  </div>
                </div>
                <div className={styles.orderStatus}>
                  <span className={styles.statusBadge}>En Camino</span>
                  <span className={styles.orderDate}>Llega Mañana</span>
                </div>
              </div>

              {/* Pedido 2 - Entregado (Verde) */}
              <div className={`${styles.orderItem} ${styles.statusDelivered}`}>
                <div className={styles.orderInfoMain}>
                  <div className={styles.orderIcon}>
                    <FaBoxOpen />
                  </div>
                  <div className={styles.orderText}>
                    <h4>Pedido #123455</h4>
                    <p>Kit de Inicio Tufting</p>
                  </div>
                </div>
                <div className={styles.orderStatus}>
                  <span className={styles.statusBadge}>Entregado</span>
                  <span className={styles.orderDate}>10 Feb 2024</span>
                </div>
              </div>

               {/* Pedido 3 - Enviado (Azul) */}
               <div className={`${styles.orderItem} ${styles.statusShipped}`}>
                <div className={styles.orderInfoMain}>
                  <div className={styles.orderIcon}>
                    <FaBoxOpen />
                  </div>
                  <div className={styles.orderText}>
                    <h4>Pedido #123450</h4>
                    <p>Lana Premium (Pack x5)</p>
                  </div>
                </div>
                <div className={styles.orderStatus}>
                  <span className={styles.statusBadge}>Enviado</span>
                  <span className={styles.orderDate}>02 Feb 2024</span>
                </div>
              </div>

            </div>
          ) : (
            /* EMPTY STATE DE LIENZO VACÍO */
            <div className={styles.emptyStateCard}>
              <div className={styles.emptyIcon}>🎨</div>
              <h3 className={styles.emptyTitle}>Tu lienzo está vacío</h3>
              <p className={styles.emptyText} style={{maxWidth:'400px', color:'var(--grey-400)'}}>
                Aún no has realizado ningún pedido. ¡Es hora de empezar a crear tu primera obra maestra!
              </p>
              <Link href="/" className={styles.createButton}>
                Explorar Tienda <FaChevronRight />
              </Link>
            </div>
          )}
        </section>


        {/* --- COLUMNA DERECHA: DATOS DE CUENTA --- */}
        <aside className={styles.accountSummary}>
          
          {/* Tarjeta de Dirección Rediseñada */}
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
              <div className={styles.addressBlock}>
                <p className={styles.addressTitle}>Casa Principal</p>
                <p className={styles.addressLine}>Calle de la Piruleta 123, 4ºA</p>
                <p className={styles.addressLine}>28001, Madrid</p>
              </div>
              
              <Link href="/dashboard/direcciones" className={styles.editLink}>
                Gestionar direcciones <FaChevronRight size={10} />
              </Link>
            </div>
          </div>

          {/* Tarjeta de Pago Rediseñada */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconBadge} ${styles.paymentBadge}`}>
                <FaCreditCard />
              </div>
              <div>
                <h3>Método de Pago</h3>
                <span className={styles.cardSubtitle}>Tarjeta principal</span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.creditCardMini}>
                <div className={styles.cardChip}>
                  <div className={styles.chipLine}></div>
                  <div className={styles.chipLine}></div>
                </div>
                <div className={styles.cardNumber}>•••• •••• •••• 4242</div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardHolder}>TITULAR</span>
                  <span className={styles.cardExpiry}>12/28</span>
                </div>
              </div>
              
              <Link href="/dashboard/pagos" className={styles.editLink}>
                Gestionar métodos <FaChevronRight size={10} />
              </Link>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
