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
import Breadcrumbs from '@/components/ui/Breadcrumbs/Breadcrumbs';
import styles from './product.module.css';

export default function ProductHeader({ product }) {
    const breadcrumbItems = [
        { label: 'Diseños de la comunidad', href: '/tienda' },
        { label: product.name }
    ];

    return (
        <header className={styles.productHeader}>
            <Breadcrumbs items={breadcrumbItems} />
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.brandRow}>
                <span className={styles.brandTag}>{product.category}</span>
            </div>
        </header>
    );
}
