/**
 * @file HeroTitle.jsx
 * @description Pieza central de la identidad visual: el gran título de bienvenida.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este título para que sea lo primero que impacte al usuario. No es un texto 
 * estático; hemos programado cada línea para que aparezca con un ritmo diferente (Staggered Animation).
 * 
 * [Por qué lo hemos hecho así]
 * Elegimos una animación escalonada para guiar la lectura, transmitir sensación de calidad y
 * mantener la legibilidad en móvil.
 *
 * ¿Por qué esta coreografía de letras?
 * 1. Jerarquía Visual: Al animar primero la frase principal y luego el subtítulo, guiamos 
 *    la lectura del usuario de forma natural.
 * 2. Sensación de Calidad: Los movimientos suaves (`easeOut` y `backOut`) transmiten que 
 *    detrás de la web hay un trabajo de diseño cuidado, igual que nuestras alfombras.
 * 3. Legibilidad: Separar el título en líneas nos permite jugar con diferentes tamaños de fuente, 
 *    haciendo que el mensaje sea potente incluso en pantallas de móvil.
 */
import React from "react";
import styles from "./HeroTitle.module.css";
import { motion } from "framer-motion";

function HeroTitle({ line1, line2, subtitle }) {
  return (
    <motion.div 
        className={styles.titleBlock}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <h1 className={styles.mainTitle}>
            <motion.span 
              className={styles.titleLine1}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {line1}
            </motion.span>
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
