/*
 * Componente: CtaBanner
 * Descripción: Banner de llamada a la acción (Call to Action) final. Muestra un título, texto persuasivo y un botón principal para incitar al usuario a diseñar su alfombra.
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
        viewport={{ once: false, amount: 0.5 }}
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
