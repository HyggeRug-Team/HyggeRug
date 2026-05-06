/**
 * @file FunnyNotification.jsx
 * @description El "Easter Egg" gamberro de la home.
 * 
 * [Nuestro enfoque]
 * Queremos romper el hielo con el usuario. Esta notificación parodia los anuncios clásicos 
 * de "cerca de ti" pero usando las alfombras reales de nuestra comunidad.
 * 
 * [Por qué lo hemos hecho así]
 * Usamos Framer Motion para que la entrada y salida sean súper fluidas. El diseño 
 * imita a nuestros botones para que, aunque sea una broma, se sienta una pieza 
 * integrada y de calidad dentro del ecosistema visual de Hygge Rug.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FunnyNotification.module.css';
import { FaXmark, FaLocationDot } from "react-icons/fa6";

export default function FunnyNotification({ products = [] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [randomProduct, setRandomProduct] = useState(null);
  const [randomPhrase, setRandomPhrase] = useState('');

  // Repertorio de frases divertidas estilo "anuncio parodia"
  const phrases = [
    "Alfombra muy suave busca pies descalzos...",
    "Diseños calientes esperándote ahora mismo.",
    "Estas viendo alfombras solo... en serio.",
    "Alfombras peludas deseando entrar en tu casa."
  ];

  useEffect(() => {
    // Seleccionamos una alfombra real de la comunidad al azar
    if (products && products.length > 0) {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      setRandomProduct(randomProd);
    }

    // Seleccionamos una frase al azar
    setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);

    const timer = setTimeout(() => {
      if (!isClosed) setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isClosed, products]);

  useEffect(() => {
    // Si la notificación está visible, la quitamos automáticamente tras 15 segundos
    if (isVisible) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
      return () => clearTimeout(hideTimer);
    }
  }, [isVisible]);

  if (!isVisible || isClosed || !randomProduct) return null;

  return (
    <AnimatePresence>
      {isVisible && !isClosed && randomProduct && (
        <motion.div 
          className={styles.container}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.3 } }}
          whileHover={{ y: -5 }}
          onClick={() => window.location.href = `/tienda/${randomProduct.product_id}`}
        >
          <button 
            className={styles.closeBtn} 
            onClick={(e) => {
              e.stopPropagation();
              setIsClosed(true);
            }}
          >
            <FaXmark />
          </button>

          <img 
            src={randomProduct.image_url || "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=150&auto=format&fit=crop"} 
            alt="Alfombra" 
            className={styles.avatar}
          />
          
          <div className={styles.infoBox}>
            <div className={styles.title}>
              <span className={styles.dot}></span>
              EN LÍNEA CERCA
            </div>
            <p className={styles.text}>
              {randomPhrase}
            </p>
            <div className={styles.distance}>
              <FaLocationDot size={12} /> A 20 km de ti
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
