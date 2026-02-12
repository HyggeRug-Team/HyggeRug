import styles from "./direcciones.module.css";
import React from 'react';

export const metadata = {
  title: "Mis Direcciones | Hygge Rug",
  description: "Gestiona tus direcciones de envío",
};

/**
 * Página Principal de Direcciones
 * 
 * Permite al usuario ver, añadir, editar y eliminar direcciones de envío.
 */
export default function DireccionesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Mis Direcciones</h1>

      <div className={styles.addressGrid}>
        {/* Lista de tarjetas de dirección */}
      </div>
    </div>
  );
}
