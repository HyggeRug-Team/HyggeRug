import styles from './dashboard.module.css';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { DashboardNav, DashboardLogout } from '@/components/dashboard/DashboardNav';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * @file layout.jsx (Grupo Dashboard)
 * @description Diseño del panel de control para un usuario que ha iniciado sesión.
 * 
 * [Nuestro enfoque]
 * Hemos implementado aquí el superpoder llamado "React Server Component".
 * Antes siquiera de que el ordenador pinte la pantalla, nuestro servidor comprueba
 * (`getSession()`) quién es el usuario directamente desde las cookies ocultas.
 * Al pasar esa información limpia al botón "DashboardLogout", nos evitamos molestas 
 * ruedas de carga (spinners) en la pantalla y prevenimos que un listillo manipule sus credenciales.
 *
 * [Por qué lo hemos hecho así]
 * Usamos esta estrategia para bloquear el panel desde el servidor y evitar depender de lógica
 * en el cliente, que siempre es más fácil de manipular.
 */
export default async function DashboardLayout({ children }) {
  const user = await getSession();

  // Protegemos TODO el grupo /dashboard: si no hay sesión válida, redirigimos.
  if (!user) redirect('/auth');

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