/**
 * @file ProductReviewModal.jsx
 * @description Modal para que el usuario valore un producto usando el componente Modal reutilizable.
 */

'use client';

import React, { useState } from 'react';
import { FaStar, FaCircleCheck } from "react-icons/fa6";
import Modal from "@/components/ui/Modal/Modal";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import { createReviewAction } from "@/lib/actions";
import styles from './ReviewModal.module.css';

export default function ProductReviewModal({ product, orderId, onClose }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const result = await createReviewAction({
      productId: product.product_id,
      orderId,
      rating,
      comment
    });

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => onClose(), 2000);
    } else {
      setError(result.error || "Error al enviar la valoración.");
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Valorar Producto"
    >
      {!isSuccess ? (
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.productMini}>
              <img src={product.image_url || '/placeholder-rug.png'} alt={product.product_name} />
            </div>
            <p className={styles.orderSubtitle}>¿Qué te ha parecido tu <strong>{product.product_name}</strong>?</p>
          </div>

          <div className={styles.body}>
            <div className={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${(hover || rating) >= star ? styles.starActive : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FaStar size={32} />
                </button>
              ))}
            </div>

            <label className={styles.label}>Cuéntanos más (opcional)</label>
            <textarea 
              className={styles.textarea}
              placeholder="¿Cómo es el tacto? ¿Los colores son como esperabas?..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            {error && <p className={styles.errorMsg}>{error}</p>}
          </div>

          <div className={styles.footer}>
            <PrimaryButton 
              text={isSubmitting ? "ENVIANDO..." : "PUBLICAR VALORACIÓN"} 
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </div>
      ) : (
        <div className={styles.success}>
          <FaCircleCheck className={styles.successIcon} />
          <h3>¡Gracias por tu opinión!</h3>
          <p>Tu valoración ayuda a otros artesanos y a mejorar nuestra comunidad.</p>
        </div>
      )}
    </Modal>
  );
}
