/**
 * @file admin/page.jsx
 * @description Panel principal para el perfil de Administrador.
 * 
 * [Nuestro enfoque]
 * Aquí el administrador tiene el control global. Por ahora hemos montado un "cascarón" 
 * visual que respeta la estética exclusiva de la tienda, pero con widgets pensados 
 * para métricas de negocio en lugar de pedidos personales.
 * 
 * [Por qué lo hemos hecho así]
 * Queremos que la experiencia sea fluida. Aunque las funcionalidades de gestión 
 * real (usuarios, stock) vendrán en la siguiente fase, dejar el layout preparado 
 * ayuda a visualizar cómo escalará el proyecto sin romper el diseño actual.
 */
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/db/users";
import styles from "./admin.module.css";
import StatsCards from "@/components/ui/Cards/StatsCard/StatsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader/DashboardHeader";
import { FaCubes, FaStar, FaHeart, FaPalette, FaArrowRotateLeft, FaUsers } from "react-icons/fa6";
import { db } from "@/lib/db";

export const metadata = {
  title: "Admin Dashboard | Hygge Rug",
  description: "Panel de administración global",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) redirect("/auth");

  const userId = session.userId || session.user_id || session.id;
  const user = await getUserById(userId).catch(() => null);

  if (user?.rol !== 'admin') {
    redirect("/dashboard/resumen");
  }

  // Obtenemos métricas reales para que el panel sea "funcional"
  const [orderCount, userCount, returnCount] = await Promise.all([
    db.query('SELECT COUNT(*) as total FROM orders WHERE order_status != "en_carrito"').then(([r]) => r[0].total),
    db.query('SELECT COUNT(*) as total FROM users').then(([r]) => r[0].total),
    db.query('SELECT COUNT(*) as total FROM order_returns WHERE status = "pendiente"').then(([r]) => r[0].total)
  ]);

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader 
        user={user} 
        session={session} 
        isAdmin={true} 
        description="Panel de administración y gestión global del negocio."
      />

      <div className={styles.adminDashboardContainer}>
        <div className={styles.statsGrid}>
          <StatsCards
            bigText={orderCount}
            smallText="Pedidos Totales"
            color="var(--button-before-hover)"
            Icon={FaCubes}
          />
          <StatsCards
            bigText={userCount}
            smallText="Usuarios"
            color="var(--highlight-text)"
            Icon={FaUsers}
          />
          <StatsCards
            bigText={returnCount}
            smallText="Devoluciones Pendientes"
            color="orange"
            Icon={FaArrowRotateLeft}
          />
        </div>

        <div className={styles.adminPlaceholderContainer}>
          <div className={styles.adminIconBox}>
            <FaPalette className={styles.adminIcon} />
          </div>
          <h2 className={styles.adminTitle}>Panel de Administración</h2>
          <p className={styles.adminDescription}>
            Aquí aparecerán las métricas globales, gestión de pedidos de clientes y
            control de stock. Esta sección está en desarrollo para la próxima versión.
          </p>
          <div className={styles.adminActionGroup}>
            <div className={styles.adminActionPlaceholder}></div>
            <div className={styles.adminActionPlaceholder}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
