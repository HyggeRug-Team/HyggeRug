/**
 * @file ProductCard.jsx
 * @description Tarjeta compacta para mostrar un producto en el panel de administración con acciones rápidas de edición y borrado.
 */
'use client';

import { memo } from 'react';
import { FaImage, FaEyeSlash, FaUsers, FaPen, FaTrash, FaRuler } from 'react-icons/fa6';
import styles from '../AdminProductsClient/AdminProductsClient.module.css';

function formatPrice(v) {
  return parseFloat(v || 0).toFixed(2) + ' €';
}

const ProductCard = memo(function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImageWrapper}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className={styles.cardImage} />
        ) : (
          <div className={styles.cardImageFallback}><FaImage /></div>
        )}

        {product.category && (
          <span className={styles.categoryBadge}>{product.category}</span>
        )}

        <div className={styles.visibilityBadges}>
          {!product.public && (
            <span className={styles.privateBadge}><FaEyeSlash /> Privado</span>
          )}
          {product.community && (
            <span className={styles.communityBadge}><FaUsers /></span>
          )}
        </div>

        <div className={styles.cardOverlay}>
          <button className={styles.editBtn} onClick={onEdit} title="Editar">
            <FaPen />
          </button>
          <button className={styles.deleteBtn} onClick={onDelete} title="Eliminar">
            <FaTrash />
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTitleRow}>
          <h3 className={styles.cardName}>{product.name}</h3>
          <span className={styles.cardPrice}>{formatPrice(product.base_price)}</span>
        </div>

        <p className={styles.cardDesc}>
          {product.description || <span className={styles.noDesc}>Sin descripción</span>}
        </p>

        <div className={styles.cardFooter}>
          <span className={styles.sizesChip}>
            <FaRuler /> {product.active_sizes ?? 0}/{product.total_sizes ?? 0} tallas
          </span>
          <span className={`${styles.statusDot} ${product.public ? styles.statusPublic : styles.statusPrivate}`} />
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
