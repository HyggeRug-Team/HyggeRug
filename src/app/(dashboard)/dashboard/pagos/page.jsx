import styles from "./pagos.module.css";
import React from 'react';

export const metadata = {
  title: "Métodos de Pago | Hygge Rug",
  description: "Gestiona tus tarjetas y métodos de pago",
};

/**
 * Página Principal de Métodos de Pago
 * 
 * Lista las tarjetas guardadas y permite añadir nuevas de forma segura.
 */
export default function PagosPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Métodos de Pago</h1>

      <div className={styles.cardsList}>
        {/* Lista de tarjetas */}
      </div>
    </div>
  );
}
