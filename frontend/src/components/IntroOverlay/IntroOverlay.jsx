"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './IntroOverlay.module.css';

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Progresión de etapas de la animación
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-overlay"
          className={styles.overlayContainer}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Anillos animados */}
          <div className={styles.ringsContainer}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.ring}
                initial={{ scale: 0, opacity: 0 }}
                animate={stage >= 2 ? {
                  scale: [0, 2 + i * 0.5],
                  opacity: [0.3, 0]
                } : {}}
                transition={{
                  duration: 2,
                  delay: i * 0.15,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Contenido central */}
          <div className={styles.contentWrapper}>
            {/* Revelación animada del logo */}
            <motion.div
              className={styles.logoContainer}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: stage >= 1 ? 1 : 0,
                scale: stage >= 1 ? 1 : 0.5,
              }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              {/* Animación letra por letra */}
              <h1 className={styles.brandName}>
                {['H','Y','G','G','E',' ','R','U','G'].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={stage >= 1 ? {
                      opacity: 1,
                      y: 0
                    } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.05,
                      ease: "easeOut"
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </h1>

              {/* Expansión del subrayado */}
              <motion.div
                className={styles.underline}
                initial={{ scaleX: 0 }}
                animate={stage >= 2 ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>

            {/* Eslogan */}
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: stage >= 2 && stage < 4 ? 1 : 0,
                y: stage >= 2 ? 0 : 30,
              }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              El arte del confort bajo tus pies
            </motion.p>
          </div>

          {/* Círculo de revelación expansivo */}
          <motion.div
            className={styles.revealCircle}
            initial={{ scale: 0 }}
            animate={{
              scale: stage >= 3 ? 150 : 0,
            }}
            transition={{
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1]
            }}
          />

          {/* Explosión de partículas */}
          <div className={styles.particles}>
            {[...Array(30)].map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const distance = 50;
              return (
                <motion.div
                  key={i}
                  className={styles.particle}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={stage >= 3 && stage < 4 ? {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5]
                  } : {}}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut"
                  }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;