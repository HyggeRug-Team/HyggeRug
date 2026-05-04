import styles from './dashboard.module.css';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { DashboardNav, DashboardLogout } from '@/components/dashboard/DashboardNav';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/db/users';

/**
 * @file layout.jsx (Grupo Dashboard)
 * @description Diseño del panel de control para un usuario que ha iniciado sesión.
 * 
 * [Nuestro enfoque]
 * Hemos implementado aquí el superpoder llamado "React Server Component".
 * Antes siquiera de que el ordenador pinte la pantalla, nuestro servidor comprueba
 * (`getSession()`) quién es el usuario directamente desde las cookies ocultas.
 * Luego extraemos su perfil fresco de la BBDD para que el sidebar muestre siempre su nickname actual.
 */
export default async function DashboardLayout({ children }) {
  const sessionUser = await getSession();

  // Protegemos TODO el grupo /dashboard: si no hay sesión válida, redirigimos.
  if (!sessionUser) redirect('/auth');

  // Obtenemos los datos frescos de la base de datos
  const userId = sessionUser.userId || sessionUser.user_id || sessionUser.id;
  let dbUser = null;
  if (userId) {
    dbUser = await getUserById(userId).catch(() => null);
  }

  // Pasamos el usuario de la DB (para tener nickname/imagen actualizados) o caemos en el de la sesión
  const user = dbUser || sessionUser;

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