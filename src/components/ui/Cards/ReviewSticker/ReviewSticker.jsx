/**
 * @file ReviewSticker.jsx
 * @description Tarjeta reutilizable para testimonios y reseñas de clientes con dos variantes visuales.
 *
 * [Nuestro enfoque]
 * Hemos creado este componente para manejar dos tipos de testimonios: reseñas destacadas
 * (amarillo brillante) y testimonios en sticker rotado. Se puede usar dinámicamente con
 * datos de la base de datos sin duplicar HTML.
 *
 * [Por qué lo hemos hecho así]
 * Una única tarjeta que se adapta según el variant (primary/secondary) facilita mantener
 * consistencia visual y reduce la necesidad de dos componentes separados. Es más mantenible
 * y permite renderizar testimonios desde BD con un solo map().
 *
 * Props:
 * - text: contenido de la reseña o testimonio
 * - author: nombre y descripción del autor
 * - rating: número de estrellas (1-5, default 5)
 * - rotation: rotación en grados (ej: -3, 2, -2) - solo aplica en variant secondary
 * - variant: 'primary' (reseña amarilla) o 'secondary' (testimonial sticker)
 */
import React from "react";
import styles from "./ReviewSticker.module.css";

function ReviewSticker({ text, author, rating = 5, rotation = 0, variant = "primary" }) {
  const isSecondary = variant === "secondary";
  const rotationStyle = isSecondary ? { transform: `rotate(${rotation}deg)` } : {};
  
  const className = isSecondary ? styles.testimonialSticker : styles.reviewSticker;
  
  return (
    <div className={className} style={rotationStyle}>
      <div className={styles.stars}>
        {"★ ".repeat(rating)}
      </div>
      <p>"{text}"</p>
      <small>{author}</small>
    </div>
  );
}

export default ReviewSticker;
