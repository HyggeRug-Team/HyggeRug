import React, { useState, useEffect, useRef } from "react";
import styles from "./HeroSection.module.css";
import SplitText from "../SplitText/SplitText";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";

// Por si queremos hacer algo cuando acabe de cargar
const handleAnimationComplete = () => {
  console.log('¡Listo!');
};

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  // Un poco de scroll listener por si acaso
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={heroRef} className={styles.heroContainer}>
      
      {/* Ese patrón de texto que se mueve de fondo, muy pro */}
      <div className={styles.typoPattern}>
        <div className={styles.scrollingTextRow}>
          <span>HYGGE RUG &nbsp; HYGGE RUG &nbsp; HYGGE RUG &nbsp; HYGGE RUG &nbsp;</span>
          <span>HYGGE RUG &nbsp; HYGGE RUG &nbsp; HYGGE RUG &nbsp; HYGGE RUG &nbsp;</span>
        </div>
        <div className={styles.scrollingTextRowReverse}>
          <span>SOFT & TUFT &nbsp; SOFT & TUFT &nbsp; SOFT & TUFT &nbsp; SOFT & TUFT &nbsp;</span>
          <span>SOFT & TUFT &nbsp; SOFT & TUFT &nbsp; SOFT & TUFT &nbsp; SOFT & TUFT &nbsp;</span>
        </div>
        <div className={styles.scrollingTextRow}>
          <span>HAND MADE &nbsp; HAND MADE &nbsp; HAND MADE &nbsp; HAND MADE &nbsp;</span>
          <span>HAND MADE &nbsp; HAND MADE &nbsp; HAND MADE &nbsp; HAND MADE &nbsp;</span>
        </div>
         <div className={styles.scrollingTextRowReverse}>
          <span>URBAN STYLE &nbsp; URBAN STYLE &nbsp; URBAN STYLE &nbsp; URBAN STYLE &nbsp;</span>
          <span>URBAN STYLE &nbsp; URBAN STYLE &nbsp; URBAN STYLE &nbsp; URBAN STYLE &nbsp;</span>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Lado Izquierdo: Copywriting agresivo y claro */}
        <div className={styles.leftColumn}>
          <div className={styles.badgeNew}>
            <span>NUEVA COLECCIÓN 2026</span>
          </div>
          
          <h1 className={styles.mainTitle}>
            <span className={styles.line1}>ALFOMBRAS</span>
            <br />
            <span className={styles.line2}>CON</span>
            <span className={styles.line3}>ACTITUD</span>
          </h1>
          
          <p className={styles.description}>
            Arte hecho a mano para pisar. Olvida las alfombras aburridas de tu abuela. 
            Hacemos <strong>Tufting Urbano</strong> con diseños que gritan estilo.
          </p>

          <div className={styles.ctaWrapper}>
            <a href="#shop" className={styles.btnPrimary}>
              <span>COMPRAR AHORA</span>
              <FaShoppingCart size={18} />
            </a>
            <a href="#custom" className={styles.btnSecondary}>
              <span>PERSONALIZAR</span>
              <FaArrowRight size={18} />
            </a>
          </div>
          
          <div className={styles.trustIndicators}>
            <span>★ 100% Hecho a Mano</span>
            <span>★ Envio Gratis ES</span>
          </div>
        </div>

        {/* Lado Derecho: La Alfombra 'Hero' */}
        <div className={styles.rightColumn}>
          <div className={styles.imageShowcase}>
            {/* Círculo de fondo vibrante */}
            <div className={styles.blobBack}></div>
            
            {/* Alfombra principal */}
            <div className={styles.floatingRug}>
              <img 
                src="/rug-gorillaz.png" 
                alt="Alfombra Tufting Gorillaz" 
                className={styles.realRugImg} 
              />
              
              {/* Etiqueta de precio flotante estilo Sticker */}
              <div className={styles.stickerPrice}>
                <span className={styles.currency}>€</span>
                <span className={styles.amount}>89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
