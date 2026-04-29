/**
 * @file ProductDescription.jsx
 * @description Bloque de texto descriptivo para el detalle de producto.
 *
 * [Nuestro enfoque]
 * Un componente puramente presentacional que organiza la información textual del 
 * producto de manera clara y legible.
 *
 * [Por qué lo hemos hecho así]
 * 1. Legibilidad: Mantiene una estructura tipográfica consistente.
 * 2. Modularidad: Separa la descripción del resto de la lógica de compra.
 */
import React from 'react';
import styles from './product.module.css';

export default function ProductDescription({ description }) {
    return (
        <div className={styles.productDescription}>
            <h3>Descripción del producto</h3>
            <p>{description}</p>
        </div>
    );
}
