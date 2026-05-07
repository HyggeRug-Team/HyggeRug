import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAddressesByUser } from "@/lib/db/addresses";
import styles from "./direcciones.module.css";
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import AddressList from "@/components/dashboard/addresses/AddressList/AddressList";

export default async function DireccionesPage() {
  const session = await getSession();
  if (!session) redirect("/auth");

  const userId = session.userId;
  let addresses = [];

  try {
    addresses = await getAddressesByUser(userId);
  } catch (err) {
    console.error("Error cargando direcciones:", err);
  }

  return (
    <div className={styles.dashboardContainer}>

      <header className={styles.headerSection}>
        <div className={styles.greeting}>
          <h1>Tus Direcciones</h1>
          <p>Gestiona dónde quieres recibir tus alfombras custom.</p>
        </div>
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <main className={styles.mainContentGrid}>
        {/* El botón de añadir y el modal viven dentro de AddressList */}
        <AddressList initialAddresses={addresses} />
      </main>

    </div>
  );
}