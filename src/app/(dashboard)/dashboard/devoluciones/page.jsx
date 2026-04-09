import styles from "./devoluciones.module.css";
import React from 'react';

export const metadata = {
  title: "Devoluciones | Hygge Rug",
  description: "Solicita y gestiona tus devoluciones",
};

/**
 * @file devoluciones/page.jsx
 * @description Vista principal de “Devoluciones”.
 *
 * [Nuestro enfoque]
 * Hemos planteado esta página como un contenedor para solicitar devoluciones y
 * visualizar el estado de las existentes.
 *
 * [Por qué lo hemos hecho así]
 * Un contenedor claro reduce confusión y nos permite añadir formularios y listas
 * sin reestructurar el diseño general del panel.
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
