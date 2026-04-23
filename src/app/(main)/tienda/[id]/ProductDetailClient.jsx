"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaTruck, FaShieldHeart, FaCrown } from 'react-icons/fa6';
import styles from './product.module.css';

export default function ProductDetailClient({ product }) {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Formateador de moneda
    const formatPrice = (p) => `${parseFloat(p).toFixed(2)}€`;

    return (
        <main className={styles.productWrapper}>
            <div className={styles.productContainer}>
                
                {/* SECCIÓN VISUAL (Sticky) */}
                <div className={styles.visualSection}>
                    <motion.div 
                        className={styles.imageBox}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image 
                            src={product.image}
                            alt={product.name}
                            fill
                            className={styles.mainImage}
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </motion.div>
                </div>

                {/* SECCIÓN DE DETALLES */}
                <div className={styles.detailsSection}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className={styles.category}>{product.category}</span>
                        <h1 className={styles.title}>{product.name}</h1>
                        <div className={styles.price}>
                            {selectedSize ? formatPrice(selectedSize.price) : formatPrice(product.basePrice)}
                        </div>
                    </motion.div>

                    <motion.p 
                        className={styles.description}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {product.description || "Esta pieza artesanal ha sido diseñada por la comunidad de Hygge Rug. Cada detalle ha sido cuidado para ofrecer una textura única y una durabilidad excepcional."}
                    </motion.p>

                    {/* SELECCIÓN DE TAMAÑO */}
                    {product.sizes.length > 0 && (
                        <div className={styles.selectionGroup}>
                            <span className={styles.label}>Selecciona el tamaño</span>
                            <div className={styles.sizeGrid}>
                                {product.sizes.map((size) => (
                                    <div 
                                        key={size.id}
                                        className={`${styles.sizeCard} ${selectedSize?.id === size.id ? styles.active : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        <span className={styles.sizeLabel}>{size.label}</span>
                                        <span className={styles.sizePrice}>{formatPrice(size.price)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ACCIONES */}
                    <div className={styles.actions}>
                        <button className={styles.addToCart}>
                            AÑADIR AL CARRITO
                        </button>
                        <button 
                            className={styles.favBtn}
                            onClick={() => setIsFavorite(!isFavorite)}
                        >
                            {isFavorite ? <FaHeart style={{color: 'var(--highlight-text)'}} /> : <FaRegHeart />}
                        </button>
                    </div>

                    {/* EXTRAS / BRANDING */}
                    <div className={styles.extras}>
                        <div className={styles.extraItem}>
                            <FaCrown className={styles.extraIcon} />
                            <div className={styles.extraText}>
                                <strong>Idea Original de:</strong> {product.requestedBy}
                            </div>
                        </div>
                        <div className={styles.extraItem}>
                            <FaTruck className={styles.extraIcon} />
                            <div className={styles.extraText}>
                                Envío gratuito en pedidos superiores a 150€
                            </div>
                        </div>
                        <div className={styles.extraItem}>
                            <FaShieldHeart className={styles.extraIcon} />
                            <div className={styles.extraText}>
                                Garantía de calidad Hygge: 100% Hecho a mano
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
