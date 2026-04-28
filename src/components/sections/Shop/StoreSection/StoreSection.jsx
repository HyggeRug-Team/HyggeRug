/**
 * @file StoreSection.jsx
 * @description Sección principal de la tienda con filtros y grid de productos.
 *
 * [Nuestro enfoque]
 * Esta sección encapsula toda la interactividad de la galería comunitaria.
 * Recibe los productos iniciales y gestiona el estado de filtrado, búsqueda y vistas.
 *
 * [Por qué lo hemos hecho así]
 * Para mantener la página (page.jsx) limpia y consistente con el resto del proyecto,
 * donde cada bloque visual es una sección independiente.
 */
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlass, FaChevronLeft, FaChevronRight, FaSliders, FaXmark } from 'react-icons/fa6';
import AnimatedGrid from '@/components/sections/Shop/AnimatedGrid/AnimatedGrid';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import CustomSelect from '@/components/ui/Inputs/CustomSelect/CustomSelect';
import ViewToggle from '@/components/ui/Buttons/ViewToggle/ViewToggle';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import styles from './StoreSection.module.css';

function SidebarContent({ categories, filter, setFilter, isDesktop, setIsFilterOpen }) {
    return (
        <>
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
                    <div className={styles.sidebarSectionTitle}>Categorías</div>
                    <div className={styles.sidebarGrid}>
                        {categories.map(opt => (
                            <button 
                                key={opt}
                                onClick={() => { 
                                    setFilter(opt); 
                                    if (!isDesktop) setIsFilterOpen(false); 
                                }}
                                className={`${styles.sidebarBtn} ${filter === opt ? styles.sidebarBtnActive : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.sidebarFooter}>
                <button 
                    className={styles.clearFiltersBtn}
                    onClick={() => {
                        setFilter('TODOS');
                        if (!isDesktop) setIsFilterOpen(false);
                    }}
                >
                    LIMPIAR FILTROS
                </button>
            </div>
        </>
    );
}

export default function StoreSection({ products }) {
    const isTouch = useIsTouchDevice();
    const sentinelRef = React.useRef(null);
    const [isAtFooter, setIsAtFooter] = useState(false);
    const [filter, setFilter] = useState('TODOS');
    const [sort, setSort] = useState('FEATURED');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [isDesktop, setIsDesktop] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Intersection Observer para detectar el final de la sección
    useEffect(() => {
        if (!isTouch || isDesktop) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Si no hay productos filtrados, no ocultamos la barra (el usuario la necesita para limpiar la búsqueda)
                if (filteredProducts.length === 0) {
                    setIsAtFooter(false);
                    return;
                }
                setIsAtFooter(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, [isTouch, isDesktop]);

    useEffect(() => {
        const saved = localStorage.getItem('shopViewMode');
        if (saved) setViewMode(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem('shopViewMode', viewMode);
    }, [viewMode]);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sortOptions = [
        { value: 'FEATURED', label: 'Destacados' },
        { value: 'LOW', label: 'Menor Precio' },
        { value: 'HIGH', label: 'Mayor Precio' }
    ];

    const ITEMS_PER_PAGE = 10;
    const dbCategories = Array.from(new Set(products.map(p => p.category)));
    const categories = ['TODOS', ...dbCategories];

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, sort, viewMode]);

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesCategory = filter === 'TODOS' || p.category === filter;
            const query = searchQuery.toLowerCase();
            return matchesCategory && (p.title?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
        });

        if (sort === 'LOW') result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        else if (sort === 'HIGH') result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        
        return result;
    }, [products, filter, searchQuery, sort]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <section className={styles.storeSection}>
            <div className={styles.shopContainer}>
                
                {/* TEXTO DE RESULTADOS */}
                <div className={styles.resultsInfoBlock}>
                    <span className={styles.resultCountText}>
                        {searchQuery ? `Resultados para "${searchQuery}"` : `Mostrando ${filteredProducts.length} creaciones`}
                    </span>
                </div>

                {/* SIDEBAR MÓVIL */}
                <AnimatePresence>
                    {!isDesktop && isFilterOpen && (
                        <>
                            <motion.div className={styles.sidebarOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} />
                            <motion.div className={styles.filterSidebar} initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}>
                                <SidebarContent categories={categories} filter={filter} setFilter={setFilter} isDesktop={isDesktop} setIsFilterOpen={setIsFilterOpen} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <div className={styles.shopContentLayout}>
                    {/* SIDEBAR ESCRITORIO */}
                    <AnimatePresence>
                        {isDesktop && isFilterOpen && (
                            <motion.aside className={styles.inlineSidebar} initial={{ width: 0, opacity: 0, marginRight: 0 }} animate={{ width: 320, opacity: 1, marginRight: 40 }} exit={{ width: 0, opacity: 0, marginRight: 0 }} transition={{ duration: 0.4 }}>
                                <div className={styles.inlineSidebarInner}>
                                    <SidebarContent categories={categories} filter={filter} setFilter={setFilter} isDesktop={isDesktop} setIsFilterOpen={setIsFilterOpen} />
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    <div className={styles.gridSection}>
                        {filteredProducts.length > 0 ? (
                            <AnimatedGrid 
                                key={viewMode} 
                                items={paginatedProducts} 
                                ItemComponent={ProductCard} 
                                itemProps={{ viewMode }} 
                                className={viewMode === 'list' ? styles.listView : styles.gridView} 
                            />
                        ) : (
                            <div className={styles.noResults}>
                                <FaMagnifyingGlass className={styles.noResultsIcon} />
                                <h3>No se han encontrado resultados</h3>
                                <p>Prueba con otros términos o limpia los filtros para ver más diseños.</p>
                                <PrimaryButton 
                                    text="LIMPIAR TODO" 
                                    onClick={() => { setSearchQuery(''); setFilter('TODOS'); }} 
                                />
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button className={styles.pageBtn} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}><FaChevronLeft /></button>
                                <span className={styles.pageInfo}>Página {currentPage} de {totalPages}</span>
                                <button className={styles.pageBtn} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}><FaChevronRight /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* BARRA DE CONTROLES (Flotante en touch, Estándar en escritorio) */}
                <div className={
                    (isTouch && !isDesktop) 
                    ? `${styles.mobileFixedDock} ${isAtFooter ? styles.atFooter : ''}` 
                    : styles.threeBlockControls
                }>
                    {(isTouch && !isDesktop) ? (
                        <>
                            <div className={styles.dockLeft}>
                                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
                            </div>

                            <div className={styles.dockCenter}>
                                <div className={styles.centerSearchBox}>
                                    <FaMagnifyingGlass className={styles.searchIconCenter} />
                                    <input 
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className={styles.searchInputCenter}
                                    />
                                </div>
                            </div>

                            <div className={styles.dockRight}>
                                <CustomSelect 
                                    value={sort} 
                                    options={sortOptions} 
                                    onChange={setSort} 
                                    placeholder="Ordenar" 
                                    minimal={true}
                                    direction="up"
                                />
                                <button 
                                    className={`${styles.openFilterBtn} ${isFilterOpen ? styles.btnActive : ''}`}
                                    onClick={() => setIsFilterOpen(true)}
                                >
                                    <FaSliders className={styles.btnIconLeft} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.controlBlockLeft}>
                                <button 
                                    className={`${styles.openFilterBtn} ${isFilterOpen ? styles.btnActive : ''}`}
                                    onClick={() => setIsFilterOpen(true)}
                                >
                                    <FaSliders className={styles.btnIconLeft} /> Filtro
                                </button>
                            </div>

                            <div className={styles.controlBlockCenter}>
                                <div className={styles.centerSearchBox}>
                                    <FaMagnifyingGlass className={styles.searchIconCenter} />
                                    <input 
                                        type="text"
                                        placeholder="Buscar diseños..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className={styles.searchInputCenter}
                                    />
                                </div>
                            </div>

                            <div className={styles.controlBlockRight}>
                                <CustomSelect value={sort} options={sortOptions} onChange={setSort} placeholder="Ordenar" />
                                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
                            </div>
                        </>
                    )}
                </div>

                {/* CENTINELA PARA DETECTAR EL FOOTER (Ahora oculta el dock) */}
                <div ref={sentinelRef} className={styles.sentinel} />
            </div>
        </section>
    );
}