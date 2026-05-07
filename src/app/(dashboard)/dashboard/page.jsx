import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";

/**
 * @file page.jsx (Dashboard Entry)
 * @description Punto de entrada que redirige al usuario según su rol.
 * 
 * [Nuestro enfoque]
 * Hemos creado un "maestro de llaves" en la raíz del dashboard. En lugar de dejar 
 * que el usuario aterrice en un sitio genérico, miramos su perfil y lo enviamos 
 * directo a su zona de trabajo (Admin o Cliente).
 * 
 * [Por qué lo hemos hecho así]
 * Para evitar que un administrador vea por error interfaces de cliente (como "Mis Pedidos") 
 * y para mantener las carpetas organizadas. Es más limpio tener una redirección 
 * central que manejar condicionales en cada sub-página.
 */
export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth");
  }

  const userId = session.userId || session.user_id || session.id;
  const user = await getUserById(userId).catch(() => null);

  // Redirección inteligente según el rol
  if (user?.rol === 'admin') {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/resumen");
  }
}
