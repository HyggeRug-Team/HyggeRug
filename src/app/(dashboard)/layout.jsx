import styles from './dashboard.module.css';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
/**
 * Layout principal del Dashboard
 * Se aplica a todas las páginas del grupo (dashboard):
 * -
 */
export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar /> 
      <main>
        {children}
      </main>
    </div>
  );
}