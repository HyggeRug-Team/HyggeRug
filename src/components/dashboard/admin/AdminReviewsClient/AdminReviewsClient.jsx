/**
 * @file AdminReviewsClient.jsx
 * @description Moderación de valoraciones con diseño premium alineado con el sistema del proyecto.
 */

'use client';

import React, { useState } from 'react';
import styles from './AdminReviews.module.css';
import { FaTrash, FaStar, FaQuoteLeft, FaCommentDots } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';

export default function AdminReviewsClient({ initialReviews, session }) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = async (reviewId) => {
    if (!confirm('¿Seguro que quieres eliminar esta valoración?')) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(r => r.review_id !== reviewId));
      }
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
    }
  };

  return (
    <div className={styles.container}>
      <DashboardHeader 
        session={session} 
        isAdmin={true} 
        title="Gestión de Valoraciones"
        description="Modera las opiniones de la comunidad y mantén la calidad de la tienda."
      />

      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{reviews.length}</span>
          <span className={styles.statLabel}>Reseñas Totales</span>
        </div>
      </div>

      <div className={styles.grid}>
        <AnimatePresence mode="popLayout">
          {reviews.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={styles.emptyState}
            >
              No hay valoraciones registradas actualmente.
            </motion.div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.review_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={styles.reviewCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.userInfo}>
                    <div className={styles.userIcon}>
                      {review.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userDetails}>
                      <strong>{review.user_name}</strong>
                      <span>ID: #{review.user_id}</span>
                    </div>
                  </div>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar 
                        key={s} 
                        className={s <= review.rating ? styles.starActive : styles.starEmpty} 
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.productRef}>
                  <span className={styles.refLabel}>Producto:</span>
                  <span className={styles.refName}>{review.product_name}</span>
                </div>

                <div className={styles.commentContent}>
                  <FaQuoteLeft className={styles.quoteIcon} />
                  <p className={styles.comment}>{review.comment || "Sin comentario escrito."}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.date}>
                    {new Date(review.creation_date).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDelete(review.review_id)}
                    className={styles.deleteBtn}
                    title="Eliminar valoración"
                  >
                    <FaTrash /> ELIMINAR
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
