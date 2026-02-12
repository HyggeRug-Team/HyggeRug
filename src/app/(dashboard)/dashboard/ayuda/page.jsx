import styles from "./ayuda.module.css";
import React from 'react';

/**
 * Página Principal de Ayuda
 * 
 * FAQ, contacto y recursos de soporte.
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
