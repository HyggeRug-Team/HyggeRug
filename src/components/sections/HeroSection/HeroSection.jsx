"use client";
import React, { useRef } from "react";
import styles from "./HeroSection.module.css";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import PrimaryBtn from '@/components/ui/Buttons/PrimaryBtn/PrimaryBtn';
import SecondaryBtn from '@/components/ui/Buttons/SecondaryBtn/SecondaryBtn';

function HeroSection() {
  const containerRef = useRef(null);

  // Aquí realizamos la configuración de las animaciones para que todo entre con estilo "pop"
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const fadeInUpElastic = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
      }
    }
  };

  const slideInRightElastic = {
    hidden: { opacity: 0, x: 40, rotate: 2 },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 20
      }
    }
  };

  return (
    <section ref={containerRef} className={styles.heroWrapper}>

      {/* Aquí realizamos el fondo de texto cinético que le da el toque urbano */}
      <div className={styles.kineticBackground}>
        <div className={styles.tickerRow} style={{ "--speed": "40s" }}>
          <span>HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG •&nbsp;</span>
          <span>HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG • HYGGE RUG •&nbsp;</span>
        </div>
        <div className={styles.tickerRowReverse} style={{ "--speed": "50s" }}>
          <span>ALFOMBRAS TUFTING • PIEZAS DE ARTE • DISEÑO ATREVIDO •&nbsp;</span>
          <span>ALFOMBRAS TUFTING • PIEZAS DE ARTE • DISEÑO ATREVIDO •&nbsp;</span>
        </div>
        <div className={styles.tickerRow} style={{ "--speed": "45s" }}>
          <span>HECHO A MEDIDA • 100% LANA • TUFTING MANUAL • TEXTURA ÚNICA •&nbsp;</span>
          <span>HECHO A MEDIDA • 100% LANA • TUFTING MANUAL • TEXTURA ÚNICA •&nbsp;</span>
        </div>
      </div>

      <motion.div
        className={styles.mainLayout}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Aquí tenemos una cabecera vacía por si acaso la necesitamos luego */}
        <div className={styles.topBar}></div>

        {/* Esto se encarga del contenido central del Hero */}
        <div className={styles.centerHero}>
          <motion.div className={styles.titleBlock} variants={fadeInUpElastic}>
            <h1 className={styles.megaTitle}>
              <motion.span
                className={styles.accentText}
                whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
              >
                TUFTING
              </motion.span>
              <br />
              <span className={styles.outlineText}>ART</span>
            </h1>
            <p className={styles.descriptionText}>
              Arte urbano para tu suelo. Diseñamos y creamos alfombras personalizadas
              con lana premium y una textura que redefine la comodidad.
            </p>
          </motion.div>

          <motion.div
            className={styles.visualBlock}
            variants={slideInRightElastic}
            whileHover={{ y: -10 }}
          >
            <div className={styles.imageContainer}>
              {/* Esto se encarga del badge de edición limitada, que va pegado a la tarjeta */}
              <motion.div variants={fadeInUpElastic} className={styles.badgeNearCard}>
                <span className={styles.badgePulse}></span>
                <span>EDICIÓN LIMITADA 2026</span>
              </motion.div>

              <div className={styles.studioLabel}>
                <div className={styles.labelHeader}>
                  <span className={styles.labelTitle}>HYGGE RUG STUDIO</span>
                  <span className={styles.labelYear}>&copy;2026</span>
                </div>
                <div className={styles.labelBody}>
                  <span className={styles.pieceName}>"GORILLAZ EDITION"</span>
                  <div className={styles.labelMeta}>
                    <span>100% LANA DE NUEVA ZELANDA</span>
                    <span>ARTE HECHO A MANO</span>
                  </div>
                </div>
              </div>

              <div className={styles.glowEffect}></div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={styles.mainRugImgWrapper}
              >
                <div className={styles.rugTextureOverlay}></div>
                <Image
                  src="/rug-gorillaz.png"
                  alt="Gorillaz Tufted Rug - Limited Edition Hand-Tufted Art"
                  width={600}
                  height={600}
                  className={styles.mainRugImg}
                  priority
                  fetchPriority="high"
                />
              </motion.div>

              <motion.div
                className={styles.tuftedPriceTag}
                animate={{ rotate: [5, 5.5, 5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={styles.tagHole}></div>
                <span className={styles.tagLabel}>COLECCIÓN Nº 03</span>
                <span className={styles.tagPrice}>89€</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Aquí realizamos el bloque inferior con los botones de acción */}
        <div className={styles.bottomHero}>
          <motion.div className={styles.ctaGroup} variants={fadeInUpElastic}>
            <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
              <PrimaryBtn text="COMPRAR AHORA" url="#shop" Icon={FaShoppingCart} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}>
              <SecondaryBtn text="ENLACE PERSONALIZADO" url="#custom" Icon={FaArrowRight} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div 
        className={styles.sideDecoration}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <span>BAJA PARA DESCUBRIR</span>
        <div className={styles.line}></div>
      </motion.div>

    </section>
  );
}

export default HeroSection;



