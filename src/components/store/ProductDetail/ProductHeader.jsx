/*
 * Archivo: ProductHeader.jsx
 * Descripción: Componente encargado de mostrar la cabecera del producto, incluyendo 
 * las migas de pan (breadcrumbs) para la navegación, el título principal y la categoría.
 */
"use client";
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
