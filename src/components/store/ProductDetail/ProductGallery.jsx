/**
 * @file ProductGallery.jsx
 * @description Galería visual del producto con acciones interactivas.
 *
 * [Nuestro enfoque]
 * Presenta la imagen principal del producto con una entrada suave y botones 
 * flotantes para acciones sociales y de fidelización.
 *
 * [Por qué lo hemos hecho así]
 * 1. Impacto visual: Usa animaciones de Framer Motion para una carga exclusiva.
 * 2. Utilidad: Integra la API Web Share para compartir fácilmente en móviles.
 * 3. Micro-interacciones: El botón de favoritos responde visualmente al clic.
 */
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShareNodes } from 'react-icons/fa6';
import styles from './product.module.css';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';

export default function ProductGallery({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: product.name, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            // Usamos el FeedbackModal para confirmar que el enlace se ha copiado
            setNotification({
                isOpen: true,
                type: 'success',
                title: 'Enlace Copiado',
                message: 'El link directo a esta alfombra se ha guardado en tu portapapeles. ¡Ya puedes compartirlo!'
            });
        }
    };

    return (
        <>
            <motion.div 
                className={styles.imageBox}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Image 
                    src={product.image}
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

            <FeedbackModal 
                isOpen={notification.isOpen}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isOpen: false })}
            />
        </>
    );
}
