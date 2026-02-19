/*
 * Componente: HeroTitle
 * Descripción: Componente específico para el título principal de la sección Hero. Aplica animaciones diferenciadas y escalonadas a cada línea del título y subtítulo.
 */
import React from "react";
import styles from "./HeroTitle.module.css";
import { motion } from "framer-motion";

// Definimos el componente para nuestro título principal con animaciones escalonadas
function HeroTitle({ line1, line2, subtitle }) {
  return (
    // Bloque principal con animación de entrada suave
    <motion.div 
        className={styles.titleBlock}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <h1 className={styles.mainTitle}>
            {/* Animamos la primera línea con un ligero efecto de escala */}
            <motion.span 
              className={styles.titleLine1}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {line1}
            </motion.span>
            {/* La segunda línea entra un poco después para crear ritmo */}
            <motion.span 
              className={styles.titleLine2}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: "backOut" }}
            >
              {line2}
            </motion.span>
        </h1>
        {subtitle && (
            <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            >
            {subtitle}
            </motion.p>
        )}
    </motion.div>
  );
}

export default HeroTitle;
