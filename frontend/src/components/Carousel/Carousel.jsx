"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Carousel.module.css";

function Carousel({ 
  images, 
  autoPlayInterval = 15000, 
  showDots = true,
  showRating = false,
  ratingValue = "4.9",
  ratingLabel = "Valoración Clientes",
  height = "500px"
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);

// El carrusel de toda la vida pero con esteroides para que mole
  useEffect(() => {
    if (!autoPlayInterval) return;
    
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % images.length;
      goToSlide(nextSlide);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, images.length, autoPlayInterval]);

  // Aquí manejamos el arrastre con el ratón, para que sea táctil también en PC
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX;
    const distance = x - startX;
    const newScrollLeft = scrollLeft - distance;
    
    // Que no se nos vaya de las manos el scroll
    const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
    carouselRef.current.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    carouselRef.current.style.scrollBehavior = 'smooth';
    
    const slideWidth = carouselRef.current.offsetWidth;
    const newSlide = Math.round(carouselRef.current.scrollLeft / slideWidth);
    setCurrentSlide(Math.max(0, Math.min(newSlide, images.length - 1)));
    carouselRef.current.scrollTo({
      left: newSlide * slideWidth,
      behavior: 'smooth'
    });
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Función para saltar a un slide concreto
  const goToSlide = (index) => {
    setCurrentSlide(index);
    const slideWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.carouselWrapper}>
      {/* Esas míticas marcas de costura en las esquinas */}
      <div className={styles.stitchTL}>✕</div>
      <div className={styles.stitchTR}>✕</div>
      <div className={styles.stitchBL}>✕</div>
      <div className={styles.stitchBR}>✕</div>

      <div className={styles.carouselContainer}>
        {/* Flechas de navegación que se ven de lejos */}
        <button 
          className={`${styles.navBtn} ${styles.prevBtn}`} 
          onClick={() => goToSlide((currentSlide - 1 + images.length) % images.length)}
          aria-label="Anterior"
        >
          ←
        </button>
        <button 
          className={`${styles.navBtn} ${styles.nextBtn}`} 
          onClick={() => goToSlide((currentSlide + 1) % images.length)}
          aria-label="Siguiente"
        >
          →
        </button>

        <div 
          ref={carouselRef}
          className={styles.carousel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {images.map((image, index) => (
            <div key={index} className={styles.slide}>
              <div className={styles.imageInner}>
                <img 
                  src={image} 
                  alt={`Slide ${index + 1}`}
                  style={{ height }}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* La etiqueta de valoración, parece que la puedes tocar */}
        {showRating && (
          <div className={styles.ratingLabelTag}>
            <div className={styles.tagHole}></div>
            <span className={styles.ratingValue}>{ratingValue}</span>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className={styles.tagText}>{ratingLabel}</span>
          </div>
        )}

        {/* Los puntitos de abajo, estilo botones de ropa */}
        {showDots && (
          <div className={styles.dots}>
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>

  );
}

export default Carousel;
