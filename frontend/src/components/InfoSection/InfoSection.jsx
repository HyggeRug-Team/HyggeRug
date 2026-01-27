"use client";
import React, { useEffect, useRef, useState } from "react";
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
import Carousel from "../Carousel/Carousel";

function InfoSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const carouselImages = [
    "/rug-mario.png",
    "/rug-gorillaz.png",
    "/rug-julieta.png",
    "/rug-irene.png",
    "/rug-shield.png"
  ];

  // Para que aparezca cuando el usuario haga scroll hasta aquí
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        
        {/* Contenido de texto */}
        <div className={styles.textContent}>
          <div className={styles.badge}>
            <FaHeart className={styles.badgeIconSmall} /> 
            <span>HECHO CON AMOR (Y PACIENCIA)</span>
          </div>
          <h2 className={styles.heading}>
            No es solo una alfombra, es el alma de la fiesta 🎉
          </h2>
          <p className={styles.description}>
            ¿Tienes un rincón soso en casa? ¿Tu salón parece una sala de espera? Tranquilo, tenemos la solución.
            Diseños que entran por los ojos y texturas que enamoran al tacto. 
            Prepárate para que tus visitas te pregunten <i>"¿De dónde sacaste eso?"</i>.
          </p>
          
          <div className={styles.buttons}>
            <a href="#crear" className={styles.primaryButton}>
              <span>Diseñar mi Obra de Arte</span>
              <FaArrowRight className={styles.arrow} />
            </a>
            <a href="#galeria" className={styles.secondaryButton}>
              <FaImages />
              <span>Inspirarme un poco</span>
            </a>
          </div>

          {/* Grid de características */}
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaHandHoldingHeart />
              </div>
              <div className={styles.featureText}>
                <h4>Hecho por Humanos</h4>
                <p>Sin fábricas humeantes. Solo manos expertas y mucho cariño.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaRulerCombined />
              </div>
              <div className={styles.featureText}>
                <h4>A tu Medida (Literal)</h4>
                <p>¿Tu salón es raro? No pasa nada, nos adaptamos a todo.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaLeaf />
              </div>
              <div className={styles.featureText}>
                <h4>Ovejas Felices</h4>
                <p>Lana 100% natural. Tan suave que querrás abrazarla.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaPiggyBank />
              </div>
              <div className={styles.featureText}>
                <h4>Sin Vender un Riñón</h4>
                <p>Lujo asiático a precio de "me lo llevo puesto".</p>
              </div>
            </div>
          </div>

          {/* Badges adicionales */}
          <div className={styles.extraBadges}>
            <div className={styles.extraBadge}>
              <FaTruck className={styles.badgeIcon} />
              <span className={styles.badgeText}>Envío Ninja (Gratis)</span>
            </div>
            <div className={styles.extraBadge}>
              <FaUndo className={styles.badgeIcon} />
              <span className={styles.badgeText}>Devolución sin Dramas</span>
            </div>
            <div className={styles.extraBadge}>
              <FaHeadset className={styles.badgeIcon} />
              <span className={styles.badgeText}>Hablamos Humano</span>
            </div>
          </div>
        </div>

        {/* Carrusel de imágenes */}
        <Carousel 
          images={carouselImages}
          autoPlayInterval={15000}
          showDots={true}
          showRating={true}
          ratingValue="4.9"
          ratingLabel="Fans Incondicionales"
          height="550px"
        />

      </div>
    </section>
  );
}

export default InfoSection;
