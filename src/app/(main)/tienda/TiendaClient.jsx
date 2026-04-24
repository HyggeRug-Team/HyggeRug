"use client";

/**
 * CLIENTE DE LA GALERÍA DE DISEÑOS DE LA COMUNIDAD
 * Gestiona la lógica de filtrado e inyecta los valores en los componentes genéricos puros.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlass, FaList, FaGrip, FaChevronLeft, FaChevronRight, FaChevronDown, FaSliders, FaXmark } from 'react-icons/fa6';
import HeroSplit from '@/components/sections/Shop/HeroSplit/HeroSplit';
import AnimatedGrid from '@/components/sections/Shop/AnimatedGrid/AnimatedGrid';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import styles from './page.module.css';

export default function TiendaClient({ products }) {
    // ESTADOS: Búsqueda, Categoría y Ordenación
    const [filter, setFilter] = useState('TODOS');
    const [sort, setSort] = useState('FEATURED');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // ESTADOS: Paginación y Vistas
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = viewMode === 'grid' ? 10 : 3;

    // Derivamos las categorías únicas de la DB para alimentar los botones de filtro
    const dbCategories = Array.from(new Set(products.map(p => p.category)));
    const categories = ['TODOS', ...dbCategories];

    // Resetear a la página 1 cuando cambia algún filtro o vista
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, sort, viewMode]);

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

        // Ajustamos la lógica de ordenación a los campos normalizados que vienen de page.jsx (price)
        if (sort === 'LOW') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sort === 'HIGH') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        
        return result;
    }, [products, filter, searchQuery, sort]);

    // PAGINACIÓN
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <main className={styles.shopWrapper}>
            <div className={styles.shopContainer}>
                
                {/* 1. HERO DE SECCIÓN */}
                <HeroSplit 
                    tag="GALERÍA COLECTIVA"
                    title="COLECCIÓN"
                    titleAccent="COLECTIVA"
                    subtitle="IDEAS QUE TOMAN FORMA"
                    description="Este no es un catálogo convencional. Cada pieza nació de la imaginación de un cliente. Si te gusta una idea ajena, puedes pedirla. O mejor aún, cuéntanos la tuya."
                    primaryAction={{
                        label: "PERSONALIZAR LA MÍA",
                        link: "/studio"
                    }}
                />

                {/* 2. TEXTO DE RESULTADOS */}
                <div className={styles.resultsInfoBlock}>
                    <span className={styles.resultCountText}>
                        {searchQuery ? `Resultados para "${searchQuery}"` : `Mostrando ${filteredProducts.length} creaciones`}
                    </span>
                </div>

                {/* 3. BARRA DE CONTROLES (3 BLOQUES SEPARADOS) */}
                <div className={styles.threeBlockControls}>
                    {/* IZQUIERDA: Filtros (Categoría y Ordenación) */}
                    <div className={styles.controlBlockLeft}>
                        <button 
                            className={`${styles.openFilterBtn} ${isFilterOpen ? styles.btnActive : ''}`}
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <FaSliders className={styles.btnIconLeft} /> Filtro
                        </button>
                    </div>

                    {/* CENTRO: Buscador */}
                    <div className={styles.controlBlockCenter}>
                        <div className={styles.centerSearchBox}>
                            <FaMagnifyingGlass className={styles.searchIconCenter} />
                            <input 
                                type="text"
                                placeholder="Buscar diseños comunitarios..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className={styles.searchInputCenter}
                            />
                        </div>
                    </div>

                    {/* DERECHA: Ordenación y Modos de Vista */}
                    <div className={styles.controlBlockRight}>
                        {/* ORDENAR POR (SELECT) */}
                        <div className={styles.inlineSortGroup}>
                            <select 
                                value={sort} 
                                onChange={(e) => setSort(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="FEATURED">Destacados</option>
                                <option value="LOW">Menor Precio</option>
                                <option value="HIGH">Mayor Precio</option>
                            </select>
                        </div>

                        <div className={styles.viewToggleGroup}>
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                            >
                                <FaGrip />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                            >
                                <FaList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR DE FILTROS (ESTILO DASHBOARD) */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <>
                            {/* OVERLAY */}
                            <motion.div 
                                className={styles.sidebarOverlay}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFilterOpen(false)}
                            />
                            {/* SIDEBAR */}
                            <motion.div 
                                className={styles.filterSidebar}
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'tween', duration: 0.3 }}
                            >
                                <div className={styles.sidebarHeader}>
                                    <div className={styles.sidebarTitle}>
                                        <FaSliders /> Filtro
                                    </div>
                                    <button className={styles.closeSidebarBtn} onClick={() => setIsFilterOpen(false)}>
                                        <FaXmark />
                                    </button>
                                </div>
                                <div className={styles.sidebarContent}>
                                    <div className={styles.sidebarSection}>
                                        <div className={styles.sidebarSectionTitle}>
                                            <FaChevronDown className={styles.sidebarIconPlus} /> Categorías
                                        </div>
                                        <div className={styles.sidebarGrid}>
                                            {categories.map(opt => (
                                                <button 
                                                    key={opt}
                                                    onClick={() => { setFilter(opt); setIsFilterOpen(false); }}
                                                    className={`${styles.sidebarBtn} ${filter === opt ? styles.sidebarBtnActive : ''}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* 4. GRID ANIMADO */}
                <AnimatedGrid 
                    items={paginatedProducts} 
                    ItemComponent={ProductCard}
                    itemProps={{ viewMode }}
                    className={viewMode === 'list' ? styles.listView : styles.gridView}
                />

                {/* 5. PAGINACIÓN */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button 
                            className={styles.pageBtn} 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            <FaChevronLeft />
                        </button>
                        <span className={styles.pageInfo}>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button 
                            className={styles.pageBtn} 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}

            </div>
        </main>
    );
}
