"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaStar, FaRegHeart, FaCartPlus } from 'react-icons/fa6';
import styles from './ProductCard.module.css';

const ProductCard = ({ title, price, image, category, status, rotation = 0 }) => {
    const isSoldOut = status === 'SIN STOCK';

    return (
        <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.imageContainer}>
                <div className={styles.productBadge}>{category}</div>
                <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                    <FaRegHeart />
                </button>
                <Image 
                    src={image} 
                    alt={title} 
                    fill
                    className={styles.productImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Only show Add to Cart if NOT sold out */}
                {!isSoldOut && (
                    <div className={styles.quickAdd}>
                        <button className={styles.quickAddBtn} aria-label="Añadir a la cesta">
                            <FaCartPlus size={18} />
                        </button>
                    </div>
                )}

                {isSoldOut && <div className={styles.soldOutOverlay}><span>AGOTADO</span></div>}
            </div>

            <div className={styles.info}>
                <div className={styles.meta}>
                    <span className={styles.categoryName}>TUFTING RUG</span>
                    <div className={styles.stars}>
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                </div>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.priceRow}>
                    <span className={styles.price}>{price}</span>
                    {status === 'DISPONIBLE' && <span className={styles.stockLabel}>EN STOCK</span>}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
