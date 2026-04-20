/**
 * @file cuenta/page.jsx
 * @description Contenedor principal de la sección "Tu Cuenta" en el dashboard.
 * 
 * [Nuestro enfoque]
 * Esta página sirve como marco para el componente UserDetails, manteniendo la consistencia 
 * de cabeceras y estructura de rejilla del panel de usuario.
 * 
 * [Por qué lo hemos hecho así]
 * Centralizar el marco visual en la página nos permite inyectar componentes complejos 
 * como el perfil sin perder la coherencia estética (widgets, títulos, espaciado).
 */

import styles from "./cuenta.module.css";
import React from 'react';
import UserDetails from "@/components/dashboard/UserDetails/UserDetails";
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import SecondaryButton from "@/components/ui/Buttons/SecondaryButton/SecondaryButton";
import { FaUserGear, FaArrowLeft } from "react-icons/fa6";

export const metadata = {
  title: "Mi Cuenta | Hygge Rug",
  description: "Edita tu información personal",
};

export default async function CuentaPage() {
  return (
    <div className={styles.dashboardContainer}>
      
      {/* ========== HEADER (Consistente con resto del Dashboard) ========== */}
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
            <h1>Tu Cuenta</h1>
            <p>Gestiona tu perfil, preferencias y seguridad.</p>
        </div>
        
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <main className={styles.mainContentGrid}>
        <div className={styles.fullWidth}>
            <UserDetails />
        </div>
      </main>
    </div>
  );
}
