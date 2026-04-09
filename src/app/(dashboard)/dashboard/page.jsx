import { redirect } from "next/navigation";

/**
 * @file page.jsx (Dashboard Home)
 * @description Punto de entrada del dashboard. Redirigimos a “Resumen”.
 *
 * [Nuestro enfoque]
 * Hemos elegido que el primer sitio al que llega el usuario sea la vista “Resumen”,
 * porque es donde mejor se entiende el panel.
 *
 * [Por qué lo hemos hecho así]
 * Redirigir desde el root reduce confusión y hace que el usuario no tenga que
 * decidir qué pantalla abrir.
 */
export default function DashboardPage() {
  redirect("/dashboard/resumen");
}
