"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSortDown } from 'react-icons/fa6';

export default function TiendaClient({ products }) {
    const [filter, setFilter] = useState('TODOS');
    const [sort, setSort] = useState('FEATURED');

    // Derivamos las categorías únicas de la DB + TODOS
    const dbCategories = Array.from(new Set(products.map(p => p.category)));
    const categories = ['TODOS', ...dbCategories];

    const filteredProducts = (filter === 'TODOS'
        ? products
        : products.filter(p => p.category === filter))
        .sort((a, b) => {
            // El precio viene como "X.XX€", quitamos el euro para ordenar
            const getPriceVal = (str) => parseFloat(str.replace('€', ''));
            if (sort === 'LOW') return getPriceVal(a.price) - getPriceVal(b.price);
            if (sort === 'HIGH') return getPriceVal(b.price) - getPriceVal(a.price);
            return 0; // FEATURED
        });

    return (
        <main className={styles.shopWrapper}>
            <div className={styles.shopContainer}>
                
                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSection}>
                        <h4 className={styles.sidebarTitle}><FaFilter /> CATEGORÍAS</h4>
                        <div className={styles.filterList}>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`${styles.filterLink} ${filter === cat ? styles.active : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sidebarSection}>
                        <h4 className={styles.sidebarTitle}><FaSortDown /> ORDENAR</h4>
                        <select className={styles.sortSelect} onChange={(e) => setSort(e.target.value)}>
                            <option value="FEATURED">Destacados</option>
                            <option value="LOW">Precio: Menor a Mayor</option>
                            <option value="HIGH">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    <header className={styles.contentHeader}>
                        <h1>CATÁLOGO DE ALFOMBRAS</h1>
                        <p className={styles.resultCount}>Mostrando {filteredProducts.length} resultados</p>
                    </header>

                    <motion.div layout className={styles.productGrid}>
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    {...product} 
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>

            </div>
        </main>
    );
}
