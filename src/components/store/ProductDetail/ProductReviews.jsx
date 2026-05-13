/**
 * @file ProductReviews.jsx
 * @description Listado de valoraciones con diseño minimalista extremo, premium y paginación.
 */

'use client';

import React, { useState } from 'react';
import styles from './product.module.css';
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductReviews({ reviews }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  if (!reviews || reviews.length === 0) return null;

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  
  // Lógica de paginación
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll suave opcional hasta el inicio de la sección de reseñas si fuera necesario
  };

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.reviewsHeaderMinimal}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.miniBadge}>VALORACIONES</span>
          <h2 className={styles.minimalTitle}>Opiniones reales</h2>
        </div>
        <div className={styles.ratingSummaryMini}>
          <div className={styles.ratingScore}>{averageRating}</div>
          <div className={styles.ratingStarsMini}>
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar key={s} size={14} className={s <= Math.round(averageRating) ? styles.starActive : styles.starEmpty} />
            ))}
          </div>
          <span className={styles.totalReviews}>{reviews.length} reseñas</span>
        </div>
      </div>

      <div className={styles.reviewsGridMinimal}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentReviews.map((review, idx) => (
              <div 
                key={review.review_id}
                className={styles.reviewCardMinimal}
              >
                <div className={styles.reviewTopMinimal}>
                  <div className={styles.userMinimal}>
                    <div className={styles.userMetaMini}>
                      <span className={styles.nameMini}>{review.user_name}</span>
                      <span className={styles.dateMini}>{new Date(review.creation_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={styles.starsMini}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={8} className={i < review.rating ? styles.starActive : styles.starEmpty} />
                    ))}
                  </div>
                </div>
                
                <p className={styles.commentMinimal}>{review.comment || "Sin comentario."}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className={styles.pageBtn}
          >
            <FaChevronLeft size={12} />
          </button>
          
          <div className={styles.pageNumbers}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.pageActive : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={styles.pageBtn}
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
}
