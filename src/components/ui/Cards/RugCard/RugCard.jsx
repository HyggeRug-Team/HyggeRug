/**
 * @file RugCard.jsx
 * @description Tarjeta interactiva de producto (alfombra) con efectos visuales avanzados.
 *
 * [Nuestro enfoque]
 * Estas tarjetas son las protagonistas de nuestra sección principal (Hero). Hemos buscado que
 * no sean “simples fotos”, sino un elemento interactivo que se entienda rápido y se sienta
 * premium.
 *
 * [Por qué lo hemos hecho así]
 * Elegimos un abanico 3D y una animación de hover porque ayudan a comunicar variedad de diseños
 * y a guiar la mirada del usuario hacia el centro del hero.
 *
 * 1. Efecto abanico: calculamos rotación y posición respecto al centro.
 * 2. Centrado: usamos `left: 50%` y cálculos simétricos para mantener el conjunto estable.
 * 3. Hover: la carta “cobra vida”, se acerca y se endereza.
 */
import React from "react";
import styles from "./RugCard.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

function RugCard({ card, index, totalCards, isHovered, onHoverStart, onHoverEnd, width }) {
  // Ajustamos los tamaños dinámicamente para que se vean bien en cualquier pantalla
  const isWide = width > 1600;
  
  // Calculamos el espacio y el ancho de la carta según el dispositivo
  const cardSpacing = width < 768 ? 50 : (isWide ? 180 : 120);
  const cardWidth = width < 768 ? 180 : (width < 1024 ? 220 : (isWide ? 380 : 280)); 
  const halfWidth = cardWidth / 2;
  
  // Buscamos el centro del grupo para que la animación sea simétrica
  const centerIndex = (totalCards - 1) / 2;
  const distanceFromCenter = index - centerIndex;

  return (
    <motion.div
      className={styles.rugPatch} 
      initial={{ rotate: 0, x: -halfWidth, y: 100, opacity: 0, scale: 0.5 }}
      animate={{
        // Rotamos las cartas en abanico
        rotate: isHovered ? 0 : distanceFromCenter * (width < 768 ? 10 : 5), 
        // Efecto arco: las de los extremos bajan un poco
        y: isHovered ? -20 : Math.abs(distanceFromCenter) * 15, 
        // Posicionamiento horizontal preciso desde el centro de la pantalla
        x: (distanceFromCenter * cardSpacing) - halfWidth,
        scale: isHovered ? 1.05 : 0.9, 
        opacity: 1,
        zIndex: isHovered ? 100 : 10 - Math.abs(distanceFromCenter)
      }}
      whileHover={{ 
        rotate: 0, 
        y: -40, 
        scale: 1.1, 
        zIndex: 100,
        rotateY: distanceFromCenter * -5, 
        rotateX: 5
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      transition={{ 
        type: "spring",
        stiffness: 150,
        damping: 20,
        mass: 1,
        delay: 0.1 + index * 0.1 
      }}
      style={{ 
        left: '50%',
        marginLeft: 0,
        '--accent-color': card.color,
        transformStyle: "preserve-3d" 
      }}
    >
        <div className={styles.patchInner}>
            <Image 
                src={card.src} 
                alt={card.name} 
                fill 
                sizes="(max-width: 768px) 250px, 300px"
                className={styles.rugImage}
                priority={index === Math.floor(totalCards/2)} 
            />
        </div>

        <div className={styles.fabricTag}>
            <span className={styles.tagText}>{card.name}</span>
        </div>
    </motion.div>
  );
}

export default RugCard;
