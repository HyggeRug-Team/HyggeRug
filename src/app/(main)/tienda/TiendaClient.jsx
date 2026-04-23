"use client";

/**
 * CLIENTE DE LA GALERÍA DE DISEÑOS DE LA COMUNIDAD
 * Este componente gestiona la visualización inmersiva de los productos,
 * el sistema de búsqueda en tiempo real y los filtros dinámicos.
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlass, FaSortDown } from 'react-icons/fa6';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import styles from './page.module.css';

export default function TiendaClient({ products }) {
    // ESTADOS: Búsqueda, Categoría y Ordenación
    const [filter, setFilter] = useState('TODOS');
    const [sort, setSort] = useState('FEATURED');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Derivamos las categorías únicas de la DB para alimentar los botones de filtro
    const dbCategories = Array.from(new Set(products.map(p => p.category)));
    const categories = ['TODOS', ...dbCategories];

    // LÓGICA DE FILTRADO Y BÚSQUEDA
    const filteredProducts = useMemo(() => {
        let result = products
            .filter(p => {
                const matchesCategory = filter === 'TODOS' || p.category === filter;
                
                const query = searchQuery.toLowerCase();
                const matchesSearch = 
                    p.title?.toLowerCase().includes(query) || 
                    p.description?.toLowerCase().includes(query);
                
                return matchesCategory && matchesSearch;
            });

        if (sort === 'LOW') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sort === 'HIGH') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        
        return result;
    }, [products, filter, searchQuery, sort]);

    return (
        <main className={styles.shopWrapper}>
            <div className={styles.shopContainer}>
                
                {/* CABECERA DE LA SECCIÓN: Rebranding a Galería Comunitaria */}
                <div className={styles.communityHero}>
                    {/* COLUMNA IZQUIERDA: Badge, Título y Subtítulo */}
                    <div className={styles.heroLeft}>
                        <span className={styles.communityBadge}>GALERÍA COLECTIVA</span>
                        <h1 className={styles.mainTitle}>
                            COLECCIÓN <span className={styles.accentText}>COLECTIVA</span>
                        </h1>
                        <h2 className={styles.subTitle}>IDEAS QUE TOMAN FORMA</h2>
                    </div>

                    {/* COLUMNA DERECHA: Descripción y CTA */}
                    <div className={styles.heroRight}>
                        <p className={styles.heroDescription}>
                            Este no es un catálogo convencional. Cada pieza nació de la imaginación de un cliente. 
                            Si te gusta una idea ajena, puedes pedirla. O mejor aún, cuéntanos la tuya.
                        </p>
                        <div className={styles.heroActions}>
                            <PrimaryButton text="PERSONALIZAR LA MÍA" url="/studio" />
                        </div>
                    </div>
                </div>

                {/* BARRA DE FILTROS FLOTANTE (PILL DESIGN)
                    Ubicada en la parte inferior para máxima usabilidad (Thumb-friendly)
                */}
                <div className={styles.filterBarSticky}>
                    <div className={styles.filterBarInner}>
                        
                        {/* BUSCADOR COMPACTO */}
                        <div className={styles.searchCompact}>
                            <FaMagnifyingGlass className={styles.searchIconMini} />
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                className={styles.searchInputMini}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.divider} />

                        {/* SELECTOR DE CATEGORÍAS */}
                        <div className={styles.filterGroupCompact}>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className={styles.divider} />

                        {/* SELECTOR DE ORDENACIÓN (CUSTOM DROPDOWN)
                            Evitamos el select nativo para mantener la estética Premium
                        */}
                        <div className={styles.sortGroupCompact} onClick={() => setIsSortOpen(!isSortOpen)}>
                            <span className={styles.sortLabelMini}>
                                {sort === 'FEATURED' ? 'TOP' : sort === 'LOW' ? '€ MIN' : '€ MAX'}
                            </span>
                            <FaSortDown className={`${styles.sortIconMini} ${isSortOpen ? styles.rotated : ''}`} />
                            
                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: -10, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={styles.customSortMenu}
                                    >
                                        <button 
                                            onClick={() => { setSort('FEATURED'); setIsSortOpen(false); }}
                                            className={sort === 'FEATURED' ? styles.activeOption : ''}
                                        >
                                            TOP VENTAS
                                        </button>
                                        <button 
                                            onClick={() => { setSort('LOW'); setIsSortOpen(false); }}
                                            className={sort === 'LOW' ? styles.activeOption : ''}
                                        >
                                            PRECIO MIN
                                        </button>
                                        <button 
                                            onClick={() => { setSort('HIGH'); setIsSortOpen(false); }}
                                            className={sort === 'HIGH' ? styles.activeOption : ''}
                                        >
                                            PRECIO MAX
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* INFORMACIÓN DE RESULTADOS */}
                <div className={styles.resultsInfoCenter}>
                    <p className={styles.resultCount}>
                        {searchQuery ? `Resultados para "${searchQuery}"` : `Mostrando ${filteredProducts.length} creaciones de la comunidad`}
                    </p>
                </div>

                {/* CUADRÍCULA DE PRODUCTOS: Animada con Framer Motion */}
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
        </main>
    );
}
