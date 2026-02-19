/*
 * Componente: HeroSection
 * Descripción: Sección principal de aterrizaje (Hero) de la página. Presenta el título principal, botones de acción (CTA) y una galería interactiva de alfombras destacadas con animaciones de entrada.
 */
"use client";
import React, { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/ui/Buttons/SecondaryButton/SecondaryButton";
import { FaPaintBrush, FaImages } from "react-icons/fa";
import HeroTitle from "@/components/ui/Titles/HeroTitle/HeroTitle";
import RugCard from "@/components/ui/Cards/RugCard/RugCard";
import ScrollHint from "@/components/ui/ScrollHint/ScrollHint";


// Simulamos la lógica del tamaño de ventana por si no tenemos el hook a mano
function useWindowWidth() {
  const [width, setWidth] = useState(0);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

function HeroSection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const width = useWindowWidth();

  // Definimos nuestros datos de ejemplo para las cartas de alfombras
  const rugCards = [
    { id: 1, name: "Mario", pattern: "checkers", color: "#E70012", src: "/rug-mario.png" },
    { id: 2, name: "Gorillaz", pattern: "lines", color: "#222", src: "/rug-gorillaz.png" },
    { id: 3, name: "Julieta", pattern: "dots", color: "#FFD700", src: "/rug-julieta.png" },
    { id: 4, name: "Shield", pattern: "dots", color: "#FF69B4", src: "/rug-shield.png" },
    { id: 5, name: "Irene", pattern: "checkers", color: "#000", src: "/rug-irene.png" },
  ];

  return (
    <div className={styles.heroWrapper} id="inicio">
      <div className={styles.heroContainer}>
        
        {/* --- TÍTULO PRINCIPAL --- */}
        <HeroTitle 
            line1="Alfombras que"
            line2="Cuentan Historias"
            subtitle="100% Personalizadas • Hechas a Mano • Edición Única"
        />

        {/* --- LAYOUT GRID: Organizamos Botón - Galería - Botón --- */}
        <div className={styles.mainContentGrid}>
            
            {/* Colocamos el botón principal a la izquierda (o abajo en móvil) */}
            <motion.div 
                className={styles.gridAreaLeft}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
            >
                <PrimaryButton 
                    text="DISEÑAR" 
                    url="#crear" 
                    Icon={FaPaintBrush} 
                />
            </motion.div>

            {/* Nuestra galería central de cartas interactivas */}
            <motion.div 
                className={`${styles.cardsGallery} ${styles.gridAreaCenter}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <AnimatePresence>
                    {rugCards.map((card, index) => {
                    const isHovered = hoveredCard === card.id;
                    return (
                        <RugCard 
                            key={card.id}
                            card={card}
                            index={index}
                            totalCards={rugCards.length}
                            isHovered={isHovered}
                            onHoverStart={() => setHoveredCard(card.id)}
                            onHoverEnd={() => setHoveredCard(null)}
                            width={width}
                        />
                    );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Colocamos el botón secundario a la derecha (o abajo en móvil) */}
            <motion.div 
                className={styles.gridAreaRight}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
            >
                <SecondaryButton 
                    text="GALERÍA" 
                    url="#galeria" 
                    Icon={FaImages} 
                />
            </motion.div>

        </div>
        
        {/* --- INDICADOR DE SCROLL --- */}
        <ScrollHint />
        
      </div>
    </div>
  )
}

export default HeroSection;
