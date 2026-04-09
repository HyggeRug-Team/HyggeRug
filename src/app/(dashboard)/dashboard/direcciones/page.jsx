import styles from "./direcciones.module.css";
import React from 'react';

export const metadata = {
  title: "Mis Direcciones | Hygge Rug",
  description: "Gestiona tus direcciones de envío",
};

/**
 * @file direcciones/page.jsx
 * @description Vista principal de “Mis Direcciones”.
 *
 * [Nuestro enfoque]
 * Hemos dejado un contenedor visual para gestionar direcciones (ver, añadir, editar).
 *
 * [Por qué lo hemos hecho así]
 * Estructurar primero la interfaz como contenedor evita cambios grandes cuando
 * conectemos datos reales (BD) y acciones futuras.
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
