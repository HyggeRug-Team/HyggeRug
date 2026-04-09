/**
 * @file FeatureCard.jsx
 * @description Tarjeta informativa para destacar beneficios o características clave de la marca.
 *
 * [Nuestro enfoque]
 * Hemos creado estas tarjetas para explicar por qué nuestras alfombras son especiales.
 * Evitamos “bloques de texto” haciendo que la información se convierta en piezas visuales
 * fáciles de escanear.
 *
 * [Por qué lo hemos hecho así]
 * Usamos animación al hacer scroll y un diseño limpio porque así mantenemos la atención del
 * usuario sin saturar la pantalla.
 *
 * 1. Animación al scroll: aparecen con `whileInView` cuando la tarjeta entra en pantalla.
 * 2. Diseño limpio: icono + título + descripción corta (“menos es más”).
 */
import React from "react";
import styles from "./FeatureCard.module.css";
import { motion } from "framer-motion";

function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      className={styles.featureCard}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }} 
      transition={{ 
        delay: delay, 
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{desc}</p>
    </motion.div>
  );
}

export default FeatureCard;
