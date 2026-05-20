/**
 * @file deseos/page.jsx
 * @description Vista principal de “Lista de Deseos”.
 *
 * [Nuestro enfoque]
 * Hemos optimizado la carga para que el usuario nunca pierda el contexto. 
 * El título y el clima aparecen al instante, mientras que los productos se cargan 
 * de forma asíncrona solo en su contenedor específico.
 *
 * [Por qué lo hemos hecho así]
 * Evitar bloqueos de página completa mejora la percepción de velocidad. 
 * Al cargar los datos solo cuando es necesario y mantener el estado local, 
 * la interfaz responde de inmediato a las interacciones (como borrar un favorito).
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
    // Actualización instantánea de la UI
    setFavorites(prev => prev.filter(p => p.product_id !== productId));
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* EL HEADER SIEMPRE SE MUESTRA DE INMEDIATO */}
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
            {loading 
              ? "Cargando tu colección de favoritos..." 
              : favorites.length > 0 
                ? `Tienes ${favorites.length} ${favorites.length === 1 ? 'diseño guardado' : 'diseños guardados'} en tu colección.`
                : "Guarda los diseños que más te gusten para verlos aquí."}
          </motion.p>
        </div>
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <main className={styles.contentArea}>
        <AnimatePresence mode="popLayout">
          {loading ? (
            /* EL LOADER SOLO APARECE EN EL CONTENEDOR DE PRODUCTOS */
            <motion.div 
               key="loader"
               className={styles.loadingState}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
              <span className={styles.loader}></span>
              <p>Buscando tus tesoros...</p>
            </motion.div>
          ) : favorites.length > 0 ? (
            <div className={styles.wishlistGrid}>
              {favorites.map((product) => (
                <motion.div
                  key={product.product_id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard 
                    id={product.product_id}
                    title={product.name}
                    description={product.description}
                    price={`${parseFloat(product.base_price).toFixed(2).replace('.', ',')}€`}
                    image={product.main_image}
                    category={product.category}
                    initialIsFavorite={true}
                    viewMode="grid"
                    onFavoriteToggle={(isFav) => {
                      if (!isFav) handleRemove(product.product_id);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              key="empty"
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
