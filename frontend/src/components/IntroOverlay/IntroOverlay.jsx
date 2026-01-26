"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './IntroOverlay.module.css';

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Bloquear scroll
    document.body.style.overflow = "hidden";
    
    // Tiempo total de la intro
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 3000);

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
          exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.8 } }} // Desaparece el contenedor al final
        >
          {/* Panel Superior */}
          <motion.div 
            className={styles.panelTop}
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          >
            <motion.div 
              className={styles.textContainer}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
            >
              <h1 className={styles.brandText}>HYGGE</h1>
            </motion.div>
          </motion.div>

          {/* Panel Inferior */}
          <motion.div 
            className={styles.panelBottom}
            initial={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          >
            <motion.div 
              className={styles.textContainer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
            >
              <h1 className={`${styles.brandText} ${styles.outline}`}>RUG</h1>
            </motion.div>
          </motion.div>

          {/* Línea central de energía */}
          <motion.div 
            className={styles.energyLine}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
