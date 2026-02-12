"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './IntroOverlay.module.css';

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 3200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  const brand = "HYGGERUG".split("");
  
  const letterVariants = {
    initial: { y: 40, opacity: 0, scale: 0.8, rotateX: -90 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        delay: 0.5 + (i * 0.08) 
      }
    }),
    exit: (i) => ({
      y: -100,
      opacity: 0,
      filter: "blur(20px)",
      transition: { duration: 0.4, delay: i * 0.02 }
    })
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={styles.mainContainer}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Creamos el Fondo de Seda Fluida - Visual y Optimizado */}
          <div className={styles.silkBackdrop}>
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i}
                className={styles.silkStream}
                animate={{ 
                  x: ["-100%", "100%"],
                  opacity: [0, 0.2, 0]
                }}
                transition={{ 
                  duration: 4 + i, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: i * 0.6
                }}
                style={{ top: `${i * 20}%` }}
              />
            ))}
            <div className={styles.gridOverlay} />
          </div>

          <div className={styles.contentHero}>
              {/* Bloques de Datos HUD en Español */}
              <div className={styles.hudDynamic}>
                  <motion.div 
                    className={styles.hudCorner}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.5, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                      <span>MODO_ESTUDIO: ACTIVO</span>
                      <span>ID_RASTREO: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                  </motion.div>
                  <motion.div 
                    className={styles.hudCorner}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 0.5, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                      <span>COORD_X: 40.41N</span>
                      <span>CALIDAD_TEJIDO: 98%</span>
                  </motion.div>
              </div>

              {/* Revelación de Marca */}
              <div className={styles.brandCore}>
                  <div className={styles.lettersGrid}>
                    {brand.map((l, i) => (
                      <motion.span
                        key={i}
                        className={styles.kineticLetter}
                        custom={i}
                        variants={letterVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {l}
                      </motion.span>
                    ))}
                  </div>
              </div>
          </div>

          <motion.div 
            className={styles.energyPulse}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1.5] }}
            transition={{ duration: 1.5, delay: 2.2, ease: "easeOut" }}
          />

          <div className={styles.vignette} />
          <div className={styles.grainLayer} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
