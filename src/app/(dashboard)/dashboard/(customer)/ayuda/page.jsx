/**
 * @file ayuda/page.jsx
 * @description Centro de Resolución y Ayuda.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este espacio para ser el centro de confianza del usuario. 
 * Combina un sistema de tickets dinámico con una sección de dudas frecuentes (FAQ) 
 * organizada por categorías visuales.
 * 
 * [Por qué lo hemos hecho así]
 * Una buena gestión de incidencias y devoluciones es lo que separa a una tienda común 
 * de una marca de confianza. Al automatizar la selección de pedidos y tipos de incidencia, 
 * facilitamos la comunicación y resolvemos fricciones rápidamente.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTicketsByUser } from "@/lib/db/support";
import { getOrdersByUser } from "@/lib/db/orders";
import { getConfigValue } from "@/lib/db/config";
import styles from "./ayuda.module.css";
import React from 'react';
import Link from 'next/link';
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import SupportDashboard from "@/components/dashboard/SupportDashboard/SupportDashboard";
import { 
  FaTruckFast, 
  FaCreditCard, 
  FaPalette, 
  FaShieldHeart,
  FaChevronDown,
  FaClock
} from "react-icons/fa6";

export const metadata = {
  title: "Ayuda y Soporte | Hygge Rug",
  description: "Centro de ayuda y devoluciones",
};

export default async function AyudaPage({ searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const { order: initialOrderId } = await searchParams;
  const userId = session.userId || session.user_id || session.id;

  let contactEmail = 'contacto@hyggerug.com';
  let tickets = [];
  let orders = [];

  try {
      [tickets, orders] = await Promise.all([
          getTicketsByUser(userId),
          getOrdersByUser(userId),
      ]);
      const emailFromConfig = await getConfigValue('contact_email');
      if (emailFromConfig) contactEmail = emailFromConfig;
  } catch (err) {
      console.error("Error cargando soporte:", err);
  }

  const faqCategories = [
    { 
      title: 'Envíos', 
      icon: <FaTruckFast />, 
      questions: [
        { q: '¿Cuánto tarda mi pedido?', a: 'El proceso artesanal toma entre 5 y 10 días, más 48h de envío.' },
        { q: '¿Cómo rastreo el paquete?', a: 'Recibirás un código de seguimiento por email al salir del taller.' }
      ]
    },
    { 
      title: 'Pagos y Reembolsos', 
      icon: <FaCreditCard />, 
      questions: [
        { q: '¿Qué métodos aceptáis?', a: 'Tarjetas bancarias, Google Pay y Apple Pay de forma segura.' },
        { q: '¿Cuándo recibiré mi reembolso?', a: 'Una vez validada la incidencia, tarda entre 3 y 5 días hábiles.' }
      ]
    }
  ];

  return (
    <div className={styles.hubContainer}>
      
      {/* HEADER HERO */}
      <header className={styles.heroSection}>
        <div className={styles.heroText}>
            <h1>¿Cómo podemos ayudarte hoy?</h1>
            <p>Desde el taller hasta tu casa, estamos aquí para resolver cualquier duda.</p>
        </div>
        <div className={styles.heroWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <div className={styles.contentLayout}>
        
        {/* COLUMNA PRINCIPAL */}
        <div className={styles.mainCol}>
           <section className={styles.activeSupport}>
              <SupportDashboard 
                 initialTickets={tickets} 
                 orders={orders} 
                 initialOrderId={initialOrderId} 
              />
           </section>
        </div>

        {/* SIDEBAR DERECHO */}
        <aside className={styles.sidebar}>
           {/* CONTACT BOX */}
           <div className={styles.contactBox}>
              <h3>Contacto Directo</h3>
              <p>Nuestro equipo responde en menos de 24h laborables.</p>
              <div className={styles.contactLinks}>
                 <a href={`mailto:${contactEmail}`} className={styles.contactItem}>
                     <FaCreditCard /> {contactEmail}
                 </a>
                 <div className={styles.workHours}>
                    <FaClock /> Lunes a Viernes: 09:00 - 18:00
                 </div>
              </div>
           </div>

           {/* FAQ MINI SECTION */}
           <div className={styles.faqSidebar}>
              <h3>Dudas Frecuentes</h3>
              <div className={styles.miniFaqList}>
                 {faqCategories[0].questions.map((q, i) => (
                   <details key={i} className={styles.miniFaqItem}>
                      <summary>{q.q} <FaChevronDown /></summary>
                      <p>{q.a}</p>
                   </details>
                 ))}
              </div>
              <Link href="/dashboard/ayuda/preguntas" className={styles.allFaqBtn}>
                 VER TODAS LAS PREGUNTAS
              </Link>
           </div>
        </aside>

      </div>
    </div>
  );
}
