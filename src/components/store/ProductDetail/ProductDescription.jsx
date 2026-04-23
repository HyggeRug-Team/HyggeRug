/*
 * Archivo: ProductDescription.jsx
 * Descripción: Renderiza la descripción detallada del producto. Componente puramente 
 * presentacional que recibe el texto descriptivo del artículo.
 */
"use client";
import React from 'react';
import styles from '@/app/(main)/tienda/[id]/product.module.css';

export default function ProductDescription({ description }) {
    return (
        <div className={styles.productDescription}>
            <h3>Descripción del producto</h3>
            <p>{description}</p>
        </div>
    );
}
