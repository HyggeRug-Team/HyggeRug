/**
 * @file deseos/page.jsx
 * @description Vista principal de “Lista de Deseos”.
 *
 * [Nuestro enfoque]
 * Organizamos los favoritos como una grilla para que el usuario reconozca rápido sus
 * alfombras y pueda volver a comprarlas.
 *
 * [Por qué lo hemos hecho así]
 * El grid es una estructura visual clara, y nos permite cambiar cómo cargamos datos
 * (más adelante) sin tocar el layout.
 */

'use client';

import styles from "./deseos.module.css";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";

export default function DeseosPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId) => {
    setFavorites(prev => prev.filter(p => p.product_id !== productId));
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingState}>
          <span className={styles.loader}></span>
          <p>Cargando tus favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Mi Lista de Deseos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {favorites.length > 0 
              ? `Tienes ${favorites.length} ${favorites.length === 1 ? 'diseño guardado' : 'diseños guardados'} en tu colección.`
              : "Guarda los diseños que más te gusten para verlos aquí."}
          </motion.p>
        </div>
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <main className={styles.wishlistGrid}>
        <AnimatePresence mode="popLayout">
          {favorites.length > 0 ? (
            favorites.map((product, index) => (
              <motion.div
                key={product.product_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  id={product.product_id}
                  title={product.name}
                  description={product.description}
                  price={`${parseFloat(product.base_price).toFixed(2)}€`}
                  image={product.main_image}
                  category={product.category}
                  initialIsFavorite={true}
                  viewMode="grid"
                  onFavoriteToggle={(isFav) => {
                    if (!isFav) handleRemove(product.product_id);
                  }}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className={styles.emptyStateCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.emptyIcon}>❤️</div>
              <h3 className={styles.emptyTitle}>Tu lista está vacía</h3>
              <p>Explora la galería de la comunidad y guarda los diseños que más te gusten para tenerlos siempre a mano.</p>
              <Link href="/tienda" className={styles.exploreBtn}>IR A LA TIENDA</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
