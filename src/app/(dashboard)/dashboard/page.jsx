import { redirect } from "next/navigation";

/**
 * Página Raíz del Dashboard
 * 
 * Por defecto, redirigimos al usuario a la vista de "Resumen",
 * que es el punto de entrada principal del panel de control.
 */
export default function DashboardPage() {
  redirect("/dashboard/resumen");
}
