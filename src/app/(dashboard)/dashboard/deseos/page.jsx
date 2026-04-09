import styles from "./deseos.module.css";
import React from 'react';

export const metadata = {
  title: "Lista de Deseos | Hygge Rug",
  description: "Tus alfombras favoritas guardadas",
};

/**
 * @file deseos/page.jsx
 * @description Vista principal de “Lista de Deseos”.
 *
 * [Nuestro enfoque]
 * Organizamos los favoritos como una grilla para que el usuario reconozca rápido sus
 * alfombras y pueda volver a comprarlas.
 *
 * [Por qué lo hemos hecho así]
 * El grid es una estructura visual clara, y nos permite cambiar cómo cargamos datos
 * (más adelante) sin tocar el layout.
 */
export default function DeseosPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Mi Lista de Deseos</h1>
      
      <div className={styles.wishlistGrid}>
        {/* Productos favoritos */}
      </div>
    </div>
  );
}
