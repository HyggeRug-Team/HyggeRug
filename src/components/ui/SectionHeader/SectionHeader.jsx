/**
 * @file SectionHeader.jsx
 * @description Cabecera estandarizada para organizar y titular las secciones de la web.
 * 
 * [Nuestro enfoque]
 * Para que la web no parezca un caos de títulos diferentes, hemos creado este componente 
 * que unifica cómo presentamos cada sección (como "Testimonios" o "Proceso").
 * 
 * [Por qué lo hemos hecho así]
 * Así mantenemos una estructura clara que el usuario reconoce rápido y que además
 * facilita mantener la interfaz consistente.
 *
 * ¿Qué elementos lo componen?
 * 1. El "Badge": Una pequeña etiqueta superior con icono que da contexto inmediato 
 *    sobre de qué trata la sección.
 * 2. Título Principal (`h2`): Usamos la etiqueta correcta para que Google entienda 
 *    la jerarquía de nuestra página (SEO).
 * 3. Animación Integrada: No hace falta configurar la animación en cada página; este 
 *    componente ya sabe que debe aparecer suavemente cuando el usuario hace scroll 
 *    hacia él, manteniendo la coherencia visual en todo el sitio.
 */
import React from "react";
import styles from "./SectionHeader.module.css";
import { motion } from "framer-motion";

function SectionHeader({ badge, icon: Icon, title, description, scrollAnimConfig }) {
  // Configuración de animación por defecto si no se proporciona una específica
  const animConfig = scrollAnimConfig || {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
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
