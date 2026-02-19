/*
 * Componente: TestimonialCard
 * Descripción: Tarjeta para mostrar reseñas y testimonios de clientes, incluyendo estrellas de valoración.
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
        viewport={{ once: false, amount: 0.5 }}
        transition={{ delay: delay, duration: 0.5 }}
    >
        <div className={styles.stars}>
            {[...Array(rating)].map((_, j) => (
            <FaStar key={j} className={styles.star} />
            ))}
        </div>
        <p className={styles.testimonialText}>"{text}"</p>
        <div className={styles.testimonialAuthor}>— {name}</div>
    </motion.div>
  );
}

export default TestimonialCard;
