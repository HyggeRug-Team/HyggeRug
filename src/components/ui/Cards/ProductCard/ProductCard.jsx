"use client";

/**
 * TARJETA DE PRODUCTO - GALERÍA DE LA COMUNIDAD
 * Este componente renderiza cada diseño individual con un enfoque premium.
 * Incluye badges de "Idea de", sistema de favoritos y micro-interacciones.
 */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaStar, FaRegHeart, FaHeart, FaCartPlus } from 'react-icons/fa6';
import styles from './ProductCard.module.css';

const ProductCard = ({ id, title, price, image, category, requestedBy }) => {
    const [isFavorite, setIsFavorite] = React.useState(false);

    // Fallbacks profesionales
    const displayRequestedBy = requestedBy || 'Anónimo';
    const displayCategory = category || 'ALFOMBRA';

    return (
        <motion.div 
            className={styles.card}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <div className={styles.imageContainer}>
                {/* BADGE DE IDEA DE */}
                <div className={styles.requestedByBadge}>
                    <span className={styles.requestedLabel}>IDEA DE</span>
                    <span className={styles.requestedName}>{displayRequestedBy}</span>
                </div>

                {/* BOTÓN DE FAVORITOS */}
                <button 
                    className={styles.wishlistBtn}
                    onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
                >
                    {isFavorite ? <FaHeart style={{ color: 'var(--highlight-text)' }} /> : <FaRegHeart />}
                </button>

                <Link href={`/tienda/${id}`}>
                    <Image 
                        src={image} 
                        alt={title} 
                        fill
                        className={styles.productImage}
                        sizes="(max-width: 768px) 100vw, 25vw"
                    />
                </Link>

                {/* BADGE DE CATEGORÍA SOBRE LA IMAGEN */}
                <div className={styles.productBadge}>{displayCategory}</div>

                {/* BOTÓN DE AÑADIR AL CARRITO (HOVER) */}
                <div className={styles.quickAdd}>
                    <button className={styles.quickAddBtn}>
                        <FaCartPlus />
                    </button>
                </div>
            </div>

            {/* INFORMACIÓN DEL PRODUCTO */}
            <div className={styles.info}>
                <div className={styles.meta}>
                    <span className={styles.categoryName}>{displayCategory}</span>
                    <div className={styles.stars}>
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                    </div>
                </div>
                
                <Link href={`/tienda/${id}`}>
                    <h3 className={styles.title}>{title}</h3>
                </Link>
                
                <div className={styles.priceRow}>
                    <span className={styles.price}>{price}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
