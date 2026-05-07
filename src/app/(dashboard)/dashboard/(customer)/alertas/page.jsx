import styles from "./alertas.module.css";
import React from 'react';

export const metadata = {
  title: "Mis Alertas | Hygge Rug",
  description: "Notificaciones y avisos importantes",
};

/**
 * @file alertas/page.jsx
 * @description Vista principal de “Mis Alertas”.
 *
 * [Nuestro enfoque]
 * Hemos creado esta sección para que el usuario vea avisos importantes en un único sitio.
 *
 * [Por qué lo hemos hecho así]
 * Estructurar primero la UI como “contenedor” nos ayuda a añadir más tarde datos reales
 * sin rehacer el layout.
 */
export default function AlertasPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Mis Alertas</h1>
      
      <div className={styles.alertsList}>
        {/* Notificaciones */}
      </div>
    </div>
  );
}
