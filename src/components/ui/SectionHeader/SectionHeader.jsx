/*
 * Componente: SectionHeader
 * Descripción: Cabecera estándar para las secciones de la página. Muestra un "badge" con icono, un título principal y una descripción opcional, todo con animaciones de entrada.
 */
import React from "react";
import styles from "./SectionHeader.module.css";
import { motion } from "framer-motion";

function SectionHeader({ badge, icon: Icon, title, description, scrollAnimConfig }) {
  // Si no nos pasan configuración de animación, usamos una por defecto
  const animConfig = scrollAnimConfig || {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.5 },
    transition: { duration: 0.6, ease: "easeOut" }
  };
  
  return (
    <motion.div 
        className={styles.sectionHeader}
        {...animConfig}
    >
        {badge && (
            <span className={styles.sectionBadge}>
                {Icon && <Icon className={styles.badgeIcon} />}
                {badge}
            </span>
        )}
        
        <h2 className={styles.sectionTitle}>
            {title}
        </h2>
        
        {description && (
            <p className={styles.sectionText}>
                {description}
            </p>
        )}
    </motion.div>
  );
}

export default SectionHeader;
