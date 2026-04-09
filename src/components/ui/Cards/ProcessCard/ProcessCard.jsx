/**
 * @file ProcessCard.jsx
 * @description Tarjeta para mostrar los pasos del proceso de creación de alfombras.
 *
 * [Nuestro enfoque]
 * Hemos creado este componente como reutilizable para que los pasos del proceso se puedan
 * renderizar dinámicamente desde la base de datos sin duplicar código HTML.
 *
 * [Por qué lo hemos hecho así]
 * Así podemos cambiar, agregar o eliminar pasos sin modificar el JSX. Solo actualizamos
 * los datos y el componente los renderiza automáticamente.
 *
 * Props:
 * - number: número del paso (01, 02, 03, etc)
 * - title: título del paso
 * - description: descripción más detallada
 * - visualBg: color de fondo del área visual
 * - visualContent: elemento React o JSX que va dentro del área visual
 */
import React from "react";
import styles from "./ProcessCard.module.css";

function ProcessCard({ number, title, description, visualBg, visualContent }) {
  return (
    <div className={styles.processCard}>
      <div className={styles.cardHeader}>
        <span className={styles.cardNumber}>{number}</span>
        <h4>{title}</h4>
      </div>
      <p>{description}</p>
      <div className={styles.cardVisual} style={{ background: visualBg }}>
        {visualContent}
      </div>
    </div>
  );
}

export default ProcessCard;
