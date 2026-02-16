import styles from './dashboard.module.css';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { getSession } from '@/lib/auth'; //Función de la sesión

/**
 * Layout Principal del Dashboard
 */
export default async function DashboardLayout({ children }) { 
  
  
  const user = await getSession(); 

  return (
    <div className={styles.dashboardLayout}>
      {/* 4. Le pasamos el objeto 'user' al Sidebar como prop */}
      <Sidebar user={user} /> 
      
      <main>
        {children}
      </main>
    </div>
  );
}