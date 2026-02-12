import styles from "./pedidos.module.css";
import React from 'react';

/**
 * Página Principal de Pedidos
 * 
 * Aquí gestionamos la lógica principal y estática de la sección de Mis Pedidos.
 * Renderiza el listado de pedidos y sus estados.
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
