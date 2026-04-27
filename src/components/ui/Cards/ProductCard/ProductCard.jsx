/**
 * @file ProductCard.jsx
 * @description Tarjeta de producto para la galería de la comunidad.
 *
 * [Nuestro enfoque]
 * Este componente renderiza cada diseño individual con un enfoque premium, 
 * soportando tanto vista de cuadrícula como de lista.
 *
 * [Por qué lo hemos hecho así]
 * 1. Versatilidad: Soporta dos modos de visualización (grid/list) con el mismo componente.
 * 2. Interactividad: Incluye badges dinámicos ("IDEA DE") y botones de acción rápida.
 * 3. Consistencia: Mantiene los mismos tokens de diseño (bordes, sombras) que el resto de la web.
 *
 * Props:
 * - id: Identificador único del producto.
 * - title: Nombre del producto.
 * - description: Breve descripción (usada en vista de lista).
 * - price: Precio formateado.
 * - image: URL de la imagen.
 * - category: Categoría del producto.
 * - requestedBy: Nombre del usuario que solicitó el diseño.
 * - viewMode: 'grid' o 'list'.
 * - href: Enlace de destino al hacer clic.
 */
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaStar, FaRegHeart, FaHeart, FaCartPlus } from 'react-icons/fa6';
import styles from './ProductCard.module.css';

const ProductCard = ({ id, title, description, price, image, category, requestedBy, viewMode, href }) => {
    const [isFavorite, setIsFavorite] = React.useState(false);

    // Fallbacks profesionales
    const displayRequestedBy = requestedBy || 'Anónimo';
    const displayCategory = category || 'ALFOMBRA';
    const finalHref = href || `/tienda/${id}`;

    const isList = viewMode === 'list';

    if (isList) {
        return (
            <motion.div 
                className={`${styles.card} ${styles.cardList}`}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
            >
                {/* LADO IZQUIERDO: IMAGEN CUADRADA */}
                <div className={styles.listImageContainer}>
                    <div className={styles.requestedByBadge}>
                        <span className={styles.requestedLabel}>IDEA DE</span>
                        <span className={styles.requestedName}>{displayRequestedBy}</span>
                    </div>

                    <button 
                        className={styles.wishlistBtn}
                        onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
                    >
                        {isFavorite ? <FaHeart style={{ color: 'var(--highlight-text)' }} /> : <FaRegHeart />}
                    </button>

                    <Link href={finalHref}>
                        <Image 
                            src={image} 
                            alt={title} 
                            fill
                            className={styles.productImage}
                            sizes="(max-width: 768px) 100vw, 30vw"
                        />
                    </Link>

                    <div className={styles.productBadge}>{displayCategory}</div>

                    <div className={styles.quickAdd}>
                        <button className={styles.quickAddBtn}>
                            <FaCartPlus />
                        </button>
                    </div>
                </div>
                
                {/* LADO DERECHO: INFO ESTILO GRID (PERO ESTIRADA) */}
                <div className={styles.listInfo}>
                    <div className={styles.meta}>
                        <span className={styles.categoryName}>{displayCategory}</span>
                        <div className={styles.stars}>
                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                        </div>
                    </div>
                    
                    <Link href={finalHref}>
                        <h3 className={styles.listTitle}>{title}</h3>
                    </Link>

                    <p className={styles.listDescription}>
                        {description || "Diseño exclusivo y personalizado creado a partir de la imaginación de la comunidad. Esta pieza representa la máxima expresión artística en formato alfombra."}
                    </p>
                    
                    <div className={styles.priceRow}>
                        <span className={styles.price}>{price}</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    // VISTA GRID ORIGINAL
    return (
        <motion.div 
            className={styles.card}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <div className={styles.imageContainer}>
                <div className={styles.requestedByBadge}>
                    <span className={styles.requestedLabel}>IDEA DE</span>
                    <span className={styles.requestedName}>{displayRequestedBy}</span>
                </div>

                <button 
                    className={styles.wishlistBtn}
                    onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
                >
                    {isFavorite ? <FaHeart style={{ color: 'var(--highlight-text)' }} /> : <FaRegHeart />}
                </button>

                <Link href={finalHref}>
                    <Image 
                        src={image} 
                        alt={title} 
                        fill
                        className={styles.productImage}
                        sizes="(max-width: 768px) 100vw, 25vw"
                    />
                </Link>

                <div className={styles.productBadge}>{displayCategory}</div>

                <div className={styles.quickAdd}>
                    <button className={styles.quickAddBtn}>
                        <FaCartPlus />
                    </button>
                </div>
            </div>

            <div className={styles.info}>
                <div className={styles.meta}>
                    <span className={styles.categoryName}>{displayCategory}</span>
                    <div className={styles.stars}>
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                    </div>
                </div>
                
                <Link href={finalHref}>
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
