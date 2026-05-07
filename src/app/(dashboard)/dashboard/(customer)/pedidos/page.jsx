/**
 * @file pedidos/page.jsx
 * @description Vista del historial de pedidos del usuario con estados dinámicos.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado esta página como un centro de control donde el usuario puede ver la evolución 
 * de todas sus alfombras. Al separar la lógica pesada en el componente OrdersHistory, 
 * mantenemos esta página ligera y optimizada para el renderizado del lado del servidor.
 * 
 * [Por qué lo hemos hecho así]
 * Un historial de pedidos profesional debe ser algo más que una lista estática. Queremos 
 * transmitir la sensación de que cada alfombra es un proyecto vivo, permitiendo al usuario 
 * rastrear, filtrar y buscar sus pedidos con una fluidez que evoque calidad y atención al detalle.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/lib/db/orders";
import styles from "./pedidos.module.css";
import React from 'react';
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import OrdersHistory from "@/components/dashboard/OrdersHistory/OrdersHistory";

export const metadata = {
  title: "Mis Pedidos | Hygge Rug",
  description: "Historial de pedidos",
};

export default async function PedidosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const userId = session.userId || session.user_id || session.id;
  let orders = [];

  try {
      orders = await getOrdersByUser(userId);
  } catch (err) {
      console.error("Error cargando pedidos:", err);
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
            <h1>Tus Pedidos</h1>
            <p>Rastrea tus creaciones desde el taller hasta tu setup.</p>
        </div>
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <OrdersHistory initialOrders={orders} />
      </main>
    </div>
  );
}
