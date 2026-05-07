import styles from "./pagos.module.css";
import React from 'react';

export const metadata = {
  title: "Métodos de Pago | Hygge Rug",
  description: "Gestiona tus tarjetas y métodos de pago",
};

/**
 * @file pagos/page.jsx
 * @description Vista principal de “Métodos de Pago”.
 *
 * [Nuestro enfoque]
 * Hemos planteado esta pantalla como contenedor de la lista de tarjetas y del acceso a
 * añadir nuevas.
 *
 * [Por qué lo hemos hecho así]
 * Mantener la página como “esqueleto” nos permite integrar la lógica de datos después
 * sin romper la estructura visual.
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
