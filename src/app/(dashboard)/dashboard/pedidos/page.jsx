import styles from "./pedidos.module.css";
import React from 'react';

/**
 * @file pedidos/page.jsx
 * @description Vista principal de “Mis Pedidos”.
 *
 * [Nuestro enfoque]
 * Hemos dejado esta página como contenedor de la sección de pedidos: título y área
 * donde se mostrará el listado.
 *
 * [Por qué lo hemos hecho así]
 * Separar la estructura del contenido facilita después integrar datos reales (BD/State)
 * sin reescribir el layout.
 */
export default function PedidosPage() {
  return (
    <div className={styles.container}>
      {/* Título y elementos importados */}
      <h1 className={styles.pageTitle}>Mis Pedidos</h1>
      
      {/* Listado de pedidos */}
      <div className={styles.ordersList}>
        {/* Aquí renderizaremos la lista de pedidos */}
      </div>
    </div>
  );
}
