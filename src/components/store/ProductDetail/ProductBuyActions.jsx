/*
 * Archivo: ProductBuyActions.jsx
 * Descripción: Componente de interacción de compra. Agrupa el selector numérico de 
 * cantidad de productos y el botón secundario para emitir la acción de añadir a la cesta.
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
