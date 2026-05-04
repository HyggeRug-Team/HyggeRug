import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/lib/db/orders";
import styles from "./preguntas.module.css";
import React from 'react';
import Link from 'next/link';
import { FaChevronLeft } from "react-icons/fa6";
import FaqSearch from "./FaqSearch";

/**
 * @file ayuda/preguntas/page.jsx
 * @description Centro avanzado de Preguntas Frecuentes (FAQ) - Server Side.
 * 
 * [Nuestro enfoque]
 * Esta página actúa como el contenedor principal de ayuda. Se encarga de la 
 * autenticación y la carga de datos de pedidos antes de delegar la interactividad 
 * al componente de búsqueda FaqSearch.
 * 
 * [Por qué lo hemos hecho así]
 * Mantener la lógica de base de datos en el servidor garantiza la seguridad de 
 * los datos del usuario y una carga inicial más eficiente de su historial de pedidos.
 */

export default async function PreguntasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) redirect("/auth");
  const userId = session.userId || session.user_id || session.id;
  const orders = await getOrdersByUser(userId);

  return (
    <div className={styles.faqPage}>
      
      {/* HEADER ESTÁTICO */}
      <header className={styles.faqHeader}>
        <div className={styles.headerTop}>
           <Link href="/dashboard/ayuda" className={styles.backBtn}>
              <FaChevronLeft /> Volver
           </Link>
        </div>
        <h1>Centro de Conocimiento</h1>
        <p>¿En qué podemos arrojar algo de luz hoy?</p>
      </header>

      <main className={styles.faqContent}>
        {/* COMPONENTE INTERACTIVO CLIENT-SIDE */}
        <FaqSearch orders={orders} />
      </main>
    </div>
  );
}
