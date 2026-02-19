/*
 * Componente: RugCard
 * Descripción: Tarjeta interactiva y animada que representa una alfombra. Incluye efectos 3D al pasar el cursor y animaciones de abanico en la galería.
 */
import React from "react";
import styles from "./RugCard.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

function RugCard({ card, index, totalCards, isHovered, onHoverStart, onHoverEnd, width }) {
  // Medidas: Escritorio 280px, Tablet 220px, Móvil 180px.
  // En pantallas muy grandes (>1600px) expandimos
  const isWide = width > 1600;
  
  // Aumentamos el espacio entre cartas para que se vean bien separadas
  const cardSpacing = width < 768 ? 50 : (isWide ? 180 : 120);
  
  // Calculamos el ancho de la carta según el dispositivo
  const cardWidth = width < 768 ? 180 : (width < 1024 ? 220 : (isWide ? 380 : 280)); 
  const halfWidth = cardWidth / 2;
  
  // Encontramos cuál es la carta central
  const centerIndex = (totalCards - 1) / 2;
  const distanceFromCenter = index - centerIndex;

  return (
    <motion.div
      className={styles.rugPatch} 
      initial={{ rotate: 0, x: -halfWidth, y: 100, opacity: 0, scale: 0.5 }}
      animate={{
        // Rotamos las cartas en abanico dependiendo de cuán lejos estén del centro
        rotate: isHovered ? 0 : distanceFromCenter * (width < 768 ? 10 : 5), 
        // Efecto arco: la carta central va más arriba que las de los lados
        y: isHovered ? -20 : Math.abs(distanceFromCenter) * 15, 
        // Espaciado horizontal relativo al centro (restamos la mitad del ancho para centrar en el origen)
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
        marginLeft: 0, // Reseteamos el margen manual porque ya usamos la traducción X desde el centro
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
