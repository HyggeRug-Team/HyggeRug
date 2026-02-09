"use client";
import React from "react";
import styles from "./InfoSection.module.css";
import { 
  FaArrowRight, 
  FaHeart, 
  FaRulerCombined, 
  FaLeaf, 
  FaPiggyBank, 
  FaTruck, 
  FaUndo, 
  FaHeadset,
  FaImages,
  FaHandHoldingHeart
} from "react-icons/fa";
import { motion } from "framer-motion";
import Carousel from '@/components/ui/Carousel/Carousel';

/**
 * Aquí montamos la sección de información con animaciones "perfectas".
 * Esto se encarga de usar Framer Motion para que todo entre de forma escalonada y suave.
 */
function InfoSection() {
  const carouselImages = [
    "/rug-mario.png",
    "/rug-gorillaz.png",
    "/rug-julieta.png",
    "/rug-irene.png",
    "/rug-shield.png"
  ];

  // Configuración de la animación del contenedor (Stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  // Animación para los elementos individuales
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 200, damping: 20 } /* Snappier 0.3s feel */
    }
  };

  // Animación específica para las tarjetas de características
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring", stiffness: 250, damping: 22 } 
    }
  };

  // Animación para que el carrusel entre desde la derecha
  const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } 
    }
  };

  return (
    <motion.section 
      className={styles.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className={styles.container}>
        
        {/* Aquí realizamos todo el contenido de texto que explica quiénes somos */}
        <div className={styles.textContent}>
          <motion.div className={styles.badge} variants={itemVariants}>
            <FaHeart className={styles.badgeIconSmall} /> 
            <span>HECHO CON AMOR (Y PACIENCIA)</span>
          </motion.div>
          <motion.h2 className={styles.heading} variants={itemVariants}>
            No es solo una alfombra, es el alma de la fiesta 🎉
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            ¿Tienes un rincón soso en casa? ¿Tu salón parece una sala de espera? Tranquilo, tenemos la solución.
            Diseños que entran por los ojos y texturas que enamoran al tacto. 
            Prepárate para que tus visitas te pregunten <i>"¿De dónde sacaste eso?"</i>.
          </motion.p>
          
          <div className={styles.buttons}>
            <motion.a 
              href="#crear" 
              className={styles.primaryButton}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span>Diseñar mi Obra de Arte</span>
              <FaArrowRight className={styles.arrow} />
            </motion.a>
            <motion.a 
              href="#galeria" 
              className={styles.secondaryButton}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <FaImages />
              <span>Inspirarme un poco</span>
            </motion.a>
          </div>

          {/* Aquí realizamos el grid de características con un efecto de pop suave */}
          <div className={styles.featuresGrid}>
            {[
              { icon: <FaHandHoldingHeart />, title: "Hecho por Humanos", desc: "Sin fábricas humeantes. Solo manos expertas y mucho cariño." },
              { icon: <FaRulerCombined />, title: "A tu Medida (Literal)", desc: "¿Tu salón es raro? No pasa nada, nos adaptamos a todo." },
              { icon: <FaLeaf />, title: "Ovejas Felices", desc: "Lana 100% natural. Tan suave que querrás abrazarla." },
              { icon: <FaPiggyBank />, title: "Sin Vender un Riñón", desc: "Lujo asiático a precio de \"me lo llevo puesto\"." }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                className={styles.feature}
                variants={cardVariants}
                whileHover={{ 
                  y: -5, 
                  scale: 1.01,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={styles.featureText}>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Aquí realizamos los badges inferiores con micro-interacciones */}
          <div className={styles.extraBadges}>
            {[
              { icon: <FaTruck />, text: "Envío Ninja (Gratis)" },
              { icon: <FaUndo />, text: "Devolución sin Dramas" },
              { icon: <FaHeadset />, text: "Hablamos Humano" }
            ].map((b, i) => (
              <motion.div 
                key={i} 
                className={styles.extraBadge}
                variants={itemVariants}
                whileHover={{ scale: 1.1, color: "var(--hover-text)" }}
              >
                {/* Clonamos el icono para aplicarle la clase de estilo */}
                {React.cloneElement(b.icon, { className: styles.badgeIcon })}
                <span className={styles.badgeText}>{b.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Esto se encarga de mostrar nuestro carrusel de trabajos realizados con su propia entrada */}
        <motion.div 
          className={styles.carouselContainerWrapper}
          variants={slideInRight}
        >
          <Carousel 
            images={carouselImages}
            autoPlayInterval={15000}
            showDots={true}
            showRating={true}
            ratingValue="4.9"
            ratingLabel="Fans Incondicionales"
            height="550px"
          />
        </motion.div>

      </div>
    </motion.section>
  );
}

export default InfoSection;
