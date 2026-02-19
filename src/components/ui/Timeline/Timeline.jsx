/*
 * Componente: Timeline
 * Descripción: Visualización de procesos paso a paso en formato vertical. Muestra números, títulos y descripciones con animaciones secuenciales de entrada.
 */
import React from "react";
import styles from "./Timeline.module.css";
import { motion } from "framer-motion";

// Creamos este componente para mostrar el proceso paso a paso de forma visual
function Timeline({ steps }) {
  return (
    <div className={styles.processTimeline}>
        {steps.map((step, i) => (
            <motion.div
            key={i}
            className={styles.timelineStep}
            // Animamos la entrada de cada paso 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            >
            <div className={styles.stepNumber}>{step.num}</div>
            <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
            </div>
            
            </motion.div>
        ))}
    </div>
  );
}

export default Timeline;
