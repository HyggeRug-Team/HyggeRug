"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './IntroOverlay.module.css';

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Dividimos los textos para animar letra por letra (Staggered effect)
  const brandTop = "HYGGE".split("");
  const brandBottom = "RUG".split("");

  useEffect(() => {
    // Bloqueamos el scroll para que no se muevan mientras ven la intro
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 1800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.4 } }} 
        >
          {/* Panel Superior estilo alfombra que sube */}
          <motion.div 
            className={styles.panelTop}
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          >
            {/* Esas míticas marcas de costura en las esquinas */}
             <motion.div 
              className={styles.decoX} 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ top: '10%', left: '5%' }}
            >✕</motion.div>

            <div className={styles.textWrapper}>
              {brandTop.map((letter, i) => (
                <motion.span
                  key={i}
                  className={styles.brandLetter}
                  data-letter={letter}
                  initial={{ y: 100, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15, 
                    delay: i * 0.05 
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Panel Inferior estilo alfombra que baja */}
          <motion.div 
            className={styles.panelBottom}
            initial={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          >
            <motion.div 
              className={styles.decoX} 
              animate={{ rotate: -360 }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ bottom: '10%', right: '5%' }}
            >✕</motion.div>

            <div className={styles.textWrapper}>
              {brandBottom.map((letter, i) => (
                <motion.span
                  key={i}
                  className={`${styles.brandLetter} ${styles.outline}`}
                  data-letter={letter}
                  initial={{ y: -100, opacity: 0, rotate: 20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15, 
                    delay: 0.3 + (i * 0.05) 
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* La línea de hilo vibrante */}
          <motion.div 
            className={styles.energyLineVibrate}
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: 1,
              y: ["-50%", "-49%", "-51%", "-50%"] 
            }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ 
              scaleX: { duration: 0.5 },
              y: { duration: 0.1, repeat: Infinity } 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
