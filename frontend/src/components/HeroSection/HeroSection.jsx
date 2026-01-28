import React, { useRef } from "react";
import styles from "./HeroSection.module.css";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import PrimaryBtn from "../PrimaryBtn/PrimaryBtn.jsx";
import SecondaryBtn from "../SecondaryBtn/SecondaryBtn.jsx";

function HeroSection() {
  const containerRef = useRef(null);

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "backOut" } }
  };

  return (
    <section ref={containerRef} className={styles.heroWrapper}>
      
      {/* --- FONDO DE TEXTO CINÉTICO --- */}
      <div className={styles.kineticBackground}>
        <div className={styles.tickerRow} style={{ "--speed": "40s" }}>
          <span>HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG •&nbsp;</span>
          <span>HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG •&nbsp;</span>
        </div>
        <div className={styles.tickerRowReverse} style={{ "--speed": "50s" }}>
          <span>TUFTING RUGS • ART PIECES • BOLD DESIGN •&nbsp;</span>
          <span>TUFTING RUGS • ART PIECES • BOLD DESIGN •&nbsp;</span>
        </div>
        <div className={styles.tickerRow} style={{ "--speed": "45s" }}>
          <span>CUSTOM MADE • 100% WOOL • HANDTUFTED • UNIQUE TEXTURE •&nbsp;</span>
          <span>CUSTOM MADE • 100% WOOL • HANDTUFTED • UNIQUE TEXTURE •&nbsp;</span>
        </div>
      </div>

      <motion.div 
        className={styles.mainLayout}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* --- CABECERA VACÍA (Manteniendo estructura por si acaso) --- */}
        <div className={styles.topBar}></div>

        {/* --- CONTENIDO CENTRAL --- */}
        <div className={styles.centerHero}>
          <motion.div className={styles.titleBlock} variants={fadeInUp}>
            <h1 className={styles.megaTitle}>
              <span className={styles.accentText}>TUFTING</span>
              <br />
              <span className={styles.outlineText}>RUGS</span>
            </h1>
            <p className={styles.descriptionText}>
              Arte urbano para tu suelo. Diseñamos y creamos alfombras personalizadas 
              con lana premium y una textura que redefine la comodidad.
            </p>
          </motion.div>

          <motion.div 
            className={styles.visualBlock}
            variants={slideInRight}
          >
            <div className={styles.imageContainer}>
              {/* Badge movido DENTRO de la tarjeta para que vaya pegado a ella */}
              <motion.div variants={fadeInUp} className={styles.badgeNearCard}>
                <span className={styles.badgePulse}></span>
                <span>EDICIÓN LIMITADA 2026</span>
              </motion.div>

              <div className={styles.glowEffect}></div>
              <motion.img 
                src="/rug-gorillaz.png" 
                alt="Main Rug" 
                className={styles.mainRugImg}
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              
              <motion.div 
                className={styles.sticker}
                animate={{ rotate: [15, 12, 18, 15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className={styles.stickerLabel}>OFERTA</span>
                <span className={styles.stickerPrice}>89€</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* --- BLOQUE INFERIOR --- */}
        <div className={styles.bottomHero}>
          <motion.div className={styles.ctaGroup} variants={fadeInUp}>
            <PrimaryBtn text="COMPRAR AHORA" url="#shop" Icon={FaShoppingCart}/>
            <SecondaryBtn text="ENLACE PERSONALIZADO" url="#custom" Icon={FaArrowRight}/>
          </motion.div>
        </div>
      </motion.div>
      <div className={styles.sideDecoration}>
        <span>SCROLL TO EXPLORE</span>
        <div className={styles.line}></div>
      </div>

    </section>
  );
}

export default HeroSection;


