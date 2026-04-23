/*
 * Archivo: ProductGallery.jsx
 * Descripción: Componente visual principal del producto. Renderiza la imagen destacada 
 * e incluye acciones interactivas flotantes (añadir a favoritos y compartir enlace).
 */
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShareNodes } from 'react-icons/fa6';
import styles from '@/app/(main)/tienda/[id]/product.module.css';

export default function ProductGallery({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: product.name, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Enlace copiado al portapapeles");
        }
    };

    return (
        <motion.div 
            className={styles.imageBox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <Image 
                src={product.image || product.image_url}
                alt={product.name}
                fill
                className={styles.mainImage}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* ACCIONES SOBRE LA IMAGEN */}
            <div className={styles.imageActions}>
                <button onClick={() => setIsFavorite(!isFavorite)} className={styles.imageActionBtn}>
                    {isFavorite ? <FaHeart color="var(--highlight-text)" /> : <FaRegHeart />}
                </button>
                <button onClick={handleShare} className={styles.imageActionBtn}>
                    <FaShareNodes />
                </button>
            </div>
        </motion.div>
    );
}
