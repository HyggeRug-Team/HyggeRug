import styles from "./ayuda.module.css";
import React from 'react';

/**
 * @file ayuda/page.jsx
 * @description Vista principal de “Ayuda y Soporte”.
 *
 * [Nuestro enfoque]
 * Hemos separado esta zona para que el usuario encuentre respuestas, contacto y recursos
 * en una pantalla clara.
 *
 * [Por qué lo hemos hecho así]
 * Así el panel queda organizado y no mezclamos ayuda con pantallas de gestión (cuenta, pedidos, etc.).
 */
export default function AyudaPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Ayuda y Soporte</h1>
      
      <div className={styles.faqSection}>
        {/* Acordeón de preguntas frecuentes */}
      </div>

      <div className={styles.contactForm}>
        {/* Formulario de contacto */}
      </div>
    </div>
  );
}
