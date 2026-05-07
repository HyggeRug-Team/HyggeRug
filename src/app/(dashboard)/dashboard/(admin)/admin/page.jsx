/**
 * @file admin/page.jsx
 * @description Panel principal para el perfil de Administrador.
 * 
 * [Nuestro enfoque]
 * Aquí el administrador tiene el control global. Por ahora hemos montado un "cascarón" 
 * visual que respeta la estética premium de la tienda, pero con widgets pensados 
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
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import { FaCubes, FaStar, FaHeart, FaPalette } from "react-icons/fa6";

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

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
          <h1>
            Hola, {user?.nickname || session.nickname || "Amigo"}{" "}
            <span className={styles.adminBadge}>ADMIN</span>
          </h1>
          <p>Panel de administración y gestión global.</p>
        </div>

        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <div className={styles.adminDashboardContainer}>
        <div className={styles.statsGrid}>
          <StatsCards
            bigText="--"
            smallText="Ventas Totales"
            color="var(--button-before-hover)"
            Icon={FaCubes}
          />
          <StatsCards
            bigText="--"
            smallText="Usuarios Activos"
            color="var(--highlight-text)"
            Icon={FaStar}
          />
          <StatsCards
            bigText="--"
            smallText="Tickets Soporte"
            color="var(--hover-text)"
            Icon={FaHeart}
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
