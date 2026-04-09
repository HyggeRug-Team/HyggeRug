/*
 * @file TestimonialCard.jsx
 * @description Tarjeta para enseñar reseñas de clientes (texto + valoración en estrellas).
 * [Nuestro enfoque]
 * Hemos creado un componente pequeño y reutilizable para que los testimonios se vean consistentes
 * en toda la web. Así evitamos repetir la misma estructura y mantenemos el código más limpio.
 *
 * [Por qué lo hemos hecho así]
 * Lo reutilizable nos ayuda a mantener un mismo estilo en toda la web y a actualizar la UI
 * con cambios mínimos.
 */
import React from "react";
import styles from "./TestimonialCard.module.css";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

function TestimonialCard({ name, text, rating = 5, delay = 0 }) {
  return (
    <motion.div
        className={styles.testimonialCard}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay, duration: 0.5 }}
    >
        <div className={styles.stars}>
            {[...Array(rating)].map((_, j) => (
            <FaStar key={j} className={styles.star} />
            ))}
        </div>
        <p className={styles.testimonialText}>&quot;{text}&quot;</p>
        <div className={styles.testimonialAuthor}>— {name}</div>
    </motion.div>
  );
}

export default TestimonialCard;
