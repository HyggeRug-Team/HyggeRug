/**
 * @file Timeline.jsx
 * @description Visualización interactiva de procesos por etapas o cronológicos.
 * 
 * [Nuestro enfoque]
 * Hemos creado este componente para explicarle al usuario de forma clara y sencilla 
 * cómo trabajamos. No queríamos una lista de texto aburrida; queríamos un viaje visual.
 * 
 * [Por qué lo hemos hecho así]
 * Hemos elegido una estructura visual para que el usuario entienda el orden del proceso
 * sin tener que leer párrafos largos.
 *
 * ¿De qué se compone nuestro Timeline?
 * 1. Indicadores Numéricos: Cada paso tiene su número rodeado por un círculo, 
 *    lo que ayuda a entender el orden del proceso al primer vistazo.
 * 2. Animación Secuencial: Los pasos no aparecen todos a la vez. Mediante `delay`, 
 *    hacemos que "caigan" uno tras otro conforme el usuario baja por la página. 
 *    Esto crea un efecto de cascada que guía la vista hacia abajo.
 * 3. Consistencia Visual: Al ser un componente que recibe datos (`Steps`), podemos 
 *    reutilizarlo para cualquier otra explicación paso a paso sin tener que repetir código.
 */
import React from "react";
import styles from "./Timeline.module.css";
import { motion } from "framer-motion";

function Timeline({ steps }) {
  return (
    <div className={styles.processTimeline}>
        {steps.map((step, i) => (
            <motion.div
            key={i}
            className={styles.timelineStep}
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
