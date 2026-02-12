import styles from "./deseos.module.css";
import React from 'react';

export const metadata = {
  title: "Lista de Deseos | Hygge Rug",
  description: "Tus alfombras favoritas guardadas",
};

/**
 * Página Principal de Lista de Deseos
 * 
 * Grid de productos marcados como favoritos con opción de compra.
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
