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

  // Auto-play del carrusel
  useEffect(() => {
    if (!autoPlayInterval) return;
    
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % images.length;
      goToSlide(nextSlide);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, images.length, autoPlayInterval]);

  // Manejo de drag con mouse
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
    
    // Asegurar que está dentro de los límites
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

  // Cambiar slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
    const slideWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.carouselContainer}>
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
            <img 
              src={image} 
              alt={`Slide ${index + 1}`}
              style={{ height }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Badge de valoración (opcional) */}
      {showRating && (
        <div className={styles.ratingBadge}>
          <span className={styles.ratingNumber}>{ratingValue}</span>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{color: 'var(--boton-after-hover)'}}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className={styles.ratingLabel}>{ratingLabel}</span>
        </div>
      )}

      {/* Dots de navegación */}
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
  );
}

export default Carousel;
