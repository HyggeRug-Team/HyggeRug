/**
 * @file ProductBuyActions.jsx
 * @description Controles de cantidad y botón de añadir a la cesta.
 *
 * [Nuestro enfoque]
 * Agrupa las acciones finales de compra en un bloque compacto y funcional.
 *
 * [Por qué lo hemos hecho así]
 * 1. Simplicidad: Combina el selector numérico con el botón de acción principal.
 * 2. Consistencia: Utiliza el `SecondaryButton` del sistema de diseño para la acción.
 */
"use client";

import React from 'react';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import styles from '@/app/(main)/tienda/[id]/product.module.css';

export default function ProductBuyActions({ quantity, setQuantity, onAdd }) {
    return (
        <div className={styles.buyActions}>
            <div className={styles.quantityWrapper}>
                <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    className={styles.quantityInput}
                />
            </div>
            <div className={styles.buttonWrapper}>
                <SecondaryButton 
                    text="AÑADIR A LA CESTA" 
                    onClick={onAdd || (() => console.log('Añadido', { quantity }))} 
                />
            </div>
        </div>
    );
}
