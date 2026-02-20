import styles from './dashboard.module.css';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { DashboardNav, DashboardLogout } from '@/components/dashboard/DashboardNav';
import { getSession } from '@/lib/auth';

/**
 * Layout Principal del Dashboard
 *
 * Usamos el Sidebar genérico pasando:
 *   - children  → DashboardNav  (logo + links de nav)
 *   - footer    → DashboardLogout (avatar + popup de logout)
 */
export default async function DashboardLayout({ children }) {
  const user = await getSession();

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar
        footer={<DashboardLogout user={user} />}
      >
        <DashboardNav />
      </Sidebar>

      <main>
        {children}
      </main>
    </div>
  );
}