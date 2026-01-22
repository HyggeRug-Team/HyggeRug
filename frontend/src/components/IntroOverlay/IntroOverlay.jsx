"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './IntroOverlay.module.css';

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Tiempo total hasta desmontar
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-overlay"
          className={styles.overlayContainer}
          // Al final, hacemos un fade out rápido para que no haya cortes bruscos
          // si el zoom no ha salido del todo de la pantalla.
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* YA NO HAY CAPA BLANCA AQUÍ.
             Directamente va el SVG máscara.
          */}

          {/* MÁSCARA NEGRA SVG */}
          <motion.svg 
            className={styles.svgLayer}
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            initial={{ scale: 1 }}
            animate={{ scale: 300 }} // Zoom gigante
            transition={{
              duration: 2.5,
              ease: [0.76, 0, 0.24, 1], // Curva cinematográfica
              delay: 0.2 // Pequeña pausa inicial
            }}
          >
            <defs>
              <mask id="text-mask" x="0" y="0" width="100%" height="100%">
                {/* El fondo blanco de la máscara hace que la capa negra sea visible */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                
                {/* El texto negro en la máscara RECORTA el agujero */}
                <text 
                  x="50" 
                  y="50" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontSize="12" 
                  fill="black" 
                  className={styles.textStyle}
                >
                  HYGGE RUG
                </text>
              </mask>
            </defs>

            {/* Rectángulo negro que aplica la máscara */}
            <rect 
              x="0" 
              y="0" 
              width="100%" 
              height="100%" 
              mask="url(#text-mask)" 
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;