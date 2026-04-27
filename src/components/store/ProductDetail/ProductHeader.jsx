/**
 * @file ProductHeader.jsx
 * @description Cabecera del detalle de producto con breadcrumbs y títulos.
 *
 * [Nuestro enfoque]
 * Este componente proporciona el contexto de navegación y la identidad del producto 
 * de un vistazo rápido.
 *
 * [Por qué lo hemos hecho así]
 * 1. SEO & Accesibilidad: Usa etiquetas nav y h1 correctamente.
 * 2. UX: Las migas de pan permiten al usuario volver atrás fácilmente.
 * 3. Branding: Resalta la categoría del producto con un estilo coherente.
 */
import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import styles from '@/app/(main)/tienda/[id]/product.module.css';

export default function ProductHeader({ product }) {
    return (
        <header className={styles.productHeader}>
            <nav className={styles.breadcrumbs}>
                <Link href="/tienda" className={styles.bLink}>Diseños de la comunidad</Link> <FaArrowRight className={styles.bIcon} /> 
                <span className={styles.current}>{product.name}</span>
            </nav>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.brandRow}>
                <span className={styles.brandTag}>{product.category}</span>
            </div>
        </header>
    );
}
