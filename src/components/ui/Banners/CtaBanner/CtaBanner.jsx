/**
 * @file CtaBanner.jsx
 * @description Banner final de llamada a la acción (CTA) con título, texto y botón principal.
 *
 * [Nuestro enfoque]
 * Hemos creado este banner para cerrar el recorrido del usuario con un mensaje claro y una acción
 * directa hacia el proceso de diseño.
 *
 * [Por qué lo hemos hecho así]
 * Usamos un componente único para que la UI sea consistente y para evitar repetir el mismo bloque
 * en varias páginas.
 */
import React from "react";
import styles from "./CtaBanner.module.css";
import { motion } from "framer-motion";
import { FaAward, FaCheckCircle } from "react-icons/fa";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";

function CtaBanner({ title, text, btnText, btnUrl, onBtnClick }) {
  return (
    <motion.div 
        className={styles.finalCta}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring" }}
    >
        <FaAward className={styles.ctaIcon} />
        <h2 className={styles.ctaTitle}>{title}</h2>
        <p className={styles.ctaText}>{text}</p>
        <div className={styles.ctaBtnContainer}>
            <PrimaryButton text={btnText} url={btnUrl} Icon={FaCheckCircle} onClick={onBtnClick} />
        </div>
    </motion.div>
  );
}

export default CtaBanner;
