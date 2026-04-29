/**
 * @file ProductPrice.jsx
 * @description Visualizador dinámico del precio del producto.
 *
 * [Nuestro enfoque]
 * Muestra el precio final calculado según la variante seleccionada, manteniendo 
 * la claridad sobre el precio base si no hay selección.
 *
 * [Por qué lo hemos hecho así]
 * 1. Claridad: Formatea siempre los precios con dos decimales y el símbolo de euro.
 * 2. Dinamismo: Se actualiza instantáneamente cuando el usuario cambia de talla.
 */
import React from 'react';
import styles from './product.module.css';

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
