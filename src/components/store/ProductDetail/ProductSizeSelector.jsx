/**
 * @file ProductSizeSelector.jsx
 * @description Selector jerárquico de medidas y variantes de producto.
 *
 * [Nuestro enfoque]
 * Hemos creado un selector que agrupa las medidas por tipos (Alfombras, Teclados) 
 * para facilitar la elección en productos con muchas variantes.
 *
 * [Por qué lo hemos hecho así]
 * 1. Organización: El agrupamiento lógico evita una lista larga y confusa.
 * 2. Feedback: Muestra el precio de cada variante antes de seleccionarla.
 * 3. UX: El diseño tipo "pop" y las animaciones lo hacen sentir moderno e interactivo.
 */
"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';
import styles from './product.module.css';

export default function ProductSizeSelector({ sizes, selectedSize, setSelectedSize }) {
    const [expandedCategory, setExpandedCategory] = useState(false);

    const formatPrice = (p) => `${parseFloat(p).toFixed(2)}€`;

    const groupedSizes = useMemo(() => {
        const groups = { "Alfombras": [], "Teclados": [] };
        sizes.forEach(size => {
            if (size.label.toLowerCase().includes("teclado")) groups["Teclados"].push(size);
            else groups["Alfombras"].push(size);
        });
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [sizes]);

    if (!sizes || sizes.length === 0) return null;

    return (
        <div className={styles.selectionGroup}>
            <span className={styles.label}>Configuración personalizada</span>
            
            <div className={styles.hierarchicalDropdown}>
                {/* BOTÓN PRINCIPAL */}
                <button 
                    className={`${styles.mainToggle} ${expandedCategory ? styles.open : ''}`}
                    onClick={() => setExpandedCategory(!expandedCategory)}
                >
                    <div className={styles.toggleLabel}>
                        <div className={styles.statusDot} />
                        <span>TAMAÑO: {selectedSize ? selectedSize.label : 'SELECCIONA'}</span>
                    </div>
                    <FaChevronDown className={styles.pinkChevron} />
                </button>

                {/* MENÚ PRINCIPAL */}
                <AnimatePresence>
                    {expandedCategory && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className={styles.mainMenu}
                        >
                            {groupedSizes.map(([category, groupSizes]) => (
                                <div key={category} className={styles.categoryGroup}>
                                    <div className={styles.categoryHeader}>
                                        <span>— {category.toUpperCase()} —</span>
                                    </div>
                                    <div className={styles.sizeList}>
                                        {groupSizes.map((size) => {
                                            const isActive = selectedSize?.id === size.id;
                                            return (
                                                <button 
                                                    key={size.id}
                                                    className={`${styles.sizeOptionBtn} ${isActive ? styles.sizeOptionActive : ''}`}
                                                    onClick={() => {
                                                        setSelectedSize(size);
                                                        setExpandedCategory(false);
                                                    }}
                                                >
                                                    <span className={styles.sizeName}>{size.label}</span>
                                                    <span className={styles.sizePrice}>{formatPrice(size.price)}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
