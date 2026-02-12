import styles from "./alertas.module.css";
import React from 'react';

export const metadata = {
  title: "Mis Alertas | Hygge Rug",
  description: "Notificaciones y avisos importantes",
};

/**
 * Página Principal de Alertas
 * 
 * Lista de notificaciones y avisos para el usuario.
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
