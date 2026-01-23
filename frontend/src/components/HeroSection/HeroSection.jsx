import React, { useState, useEffect, useRef } from "react";
import styles from "./HeroSection.module.css";
import SplitText from "../SplitText/SplitText";

// Callback cuando termina la animación
const handleAnimationComplete = () => {
  console.log('¡Todas las letras han sido animadas!');
};

function HeroSection() {
  const [key, setKey] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  // Reiniciar animación cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Efecto parallax al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef}
      className={styles.heroContainer}
      style={{
        transform: `translateY(${scrollY * 0.5}px)`
      }}
    >
      <div className={styles.heroBackground}></div>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <SplitText
          key={key}
          text="El arte del confort bajo tus pies"
          className={styles.heroTitle}
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
          tag="h1"
        />
      </div>
    </div>
  );
}

export default HeroSection;
