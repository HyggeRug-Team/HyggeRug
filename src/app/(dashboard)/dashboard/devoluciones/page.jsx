import styles from "./devoluciones.module.css";
import React from 'react';

export const metadata = {
  title: "Devoluciones | Hygge Rug",
  description: "Solicita y gestiona tus devoluciones",
};

/**
 * Página Principal de Devoluciones
 * 
 * Permite al usuario solicitar nuevas devoluciones y ver el estado de las existentes.
 */
export default function DevolucionesPage() {
  return (
    <div className={styles.container}>
      {/* Título y navegación de pestañas */}
      <h1 className={styles.pageTitle}>Devoluciones</h1>

      {/* Contenido principal o formulario de solicitud */}
      <div className={styles.content}>
        {/* Aquí renderizaremos el contenido de devoluciones */}
      </div>
    </div>
  );
}
