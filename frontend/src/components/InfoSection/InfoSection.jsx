"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./InfoSection.module.css";
import { FaArrowRight } from "react-icons/fa";
import Carousel from "../Carousel/Carousel";

function InfoSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const carouselImages = [
    "/carousel-1.png",
    "/carousel-2.png",
    "/carousel-3.png"
  ];

  // Observer para detectar visibilidad
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
          <span className={styles.badge}>NUEVA COLECCIÓN</span>
          <h2 className={styles.heading}>
            Alfombras a medida para tu lugar feliz
          </h2>
          <p className={styles.description}>
            Porque tu suelo también merece un abrazo. Diseña una alfombra que se 
            adapte perfectamente a tu espacio (y a tu rollo).
          </p>
          
          <div className={styles.buttons}>
            <a href="#" className={styles.primaryButton}>
              <span>Empezar a diseñar</span>
              <FaArrowRight className={styles.arrow} />
            </a>
            <a href="#" className={styles.secondaryButton}>
              Ver catálogo
            </a>
          </div>

          <div className={styles.shipping}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 6.1L7.1 11c-.2.2-.5.2-.7 0l-2-2c-.2-.2-.2-.5 0-.7s.5-.2.7 0l1.6 1.6 4-4.5c.2-.2.5-.2.7 0 .3.2.3.5.1.7z"/>
            </svg>
            <span>Envío gratis en pedidos personalizados</span>
          </div>
        </div>

        {/* Carrusel de imágenes */}
        <Carousel 
          images={carouselImages}
          autoPlayInterval={15000}
          showDots={true}
          showRating={true}
          ratingValue="4.9"
          ratingLabel="Valoración Clientes"
          height="500px"
        />

      </div>
    </section>
  );
}

export default InfoSection;
