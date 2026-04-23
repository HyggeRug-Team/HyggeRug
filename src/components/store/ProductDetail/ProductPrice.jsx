/*
 * Archivo: ProductPrice.jsx
 * Descripción: Muestra dinámicamente el precio del producto. Si hay una talla seleccionada, 
 * muestra el precio de dicha variante; de lo contrario, muestra el precio base por defecto.
 */
"use client";
import React from 'react';
import styles from '@/app/(main)/tienda/[id]/product.module.css';

export default function ProductPrice({ basePrice, selectedSizePrice }) {
    const formatPrice = (p) => `${parseFloat(p).toFixed(2)}€`;
    
    return (
        <div className={styles.priceSection}>
            <div className={styles.priceContainer}>
                <span className={styles.currentPrice}>
                    {selectedSizePrice ? formatPrice(selectedSizePrice) : formatPrice(basePrice)}
                </span>
            </div>
            <span className={styles.priceLabel}>Todos los precios incluyen IVA</span>
        </div>
    );
}
