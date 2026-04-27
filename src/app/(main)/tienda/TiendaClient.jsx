/**
 * @file TiendaClient.jsx
 * @description Cliente de la galería de diseños de la comunidad.
 *
 * [Nuestro enfoque]
 * Este componente gestiona la lógica de filtrado, búsqueda y ordenación de los productos 
 * creados por la comunidad. Inyecta los datos en componentes genéricos puros para 
 * mantener la separación de responsabilidades.
 *
 * [Por qué lo hemos hecho así]
 * 1. Modularidad: Utilizamos componentes genéricos para los controles (CustomSelect, ViewToggle).
 * 2. Rendimiento: Usamos useMemo para filtrar los productos solo cuando es necesario.
 * 3. UX: Implementamos una barra de controles dividida en 3 bloques para una navegación intuitiva.
 */
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlass, FaChevronLeft, FaChevronRight, FaChevronDown, FaSliders, FaXmark } from 'react-icons/fa6';
import HeroSplit from '@/components/sections/Shop/HeroSplit/HeroSplit';
import AnimatedGrid from '@/components/sections/Shop/AnimatedGrid/AnimatedGrid';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import CustomSelect from '@/components/ui/Inputs/CustomSelect/CustomSelect';
import ViewToggle from '@/components/ui/Buttons/ViewToggle/ViewToggle';
import styles from './page.module.css';

/** Contenido del sidebar de filtros. Extraído fuera del render para evitar recreaciones. */
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
                    <div className={styles.sidebarSectionTitle}>
                        <FaChevronDown className={styles.sidebarIconPlus} /> Categorías
                    </div>
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
        </>
    );
}

export default function TiendaClient({ products }) {
    // ESTADOS: Búsqueda, Categoría y Ordenación
    const [filter, setFilter] = useState('TODOS');
    const [sort, setSort] = useState('FEATURED');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const sortOptions = [
        { value: 'FEATURED', label: 'Destacados' },
        { value: 'LOW', label: 'Menor Precio' },
        { value: 'HIGH', label: 'Mayor Precio' }
    ];

    // ESTADOS: Paginación y Vistas
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [isDesktop, setIsDesktop] = useState(true);

    // Forzamos la vista de lista en móviles y tablets
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 1024);
            if (window.innerWidth <= 768) {
                setViewMode('list');
            }
        };
        // Chequeo inicial
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const ITEMS_PER_PAGE = 10;

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
                        <CustomSelect 
                            value={sort}
                            options={sortOptions}
                            onChange={setSort}
                            placeholder="Ordenar por"
                        />

                        <ViewToggle 
                            currentView={viewMode}
                            onViewChange={setViewMode}
                        />
                    </div>
                </div>

                {/* SIDEBAR MÓVIL (MODAL FIJO) */}
                <AnimatePresence>
                    {!isDesktop && isFilterOpen && (
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
                                <SidebarContent 
                                    categories={categories}
                                    filter={filter}
                                    setFilter={setFilter}
                                    isDesktop={isDesktop}
                                    setIsFilterOpen={setIsFilterOpen}
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <div className={styles.shopContentLayout}>
                    {/* SIDEBAR ESCRITORIO (INLINE) */}
                    <AnimatePresence>
                        {isDesktop && isFilterOpen && (
                            <motion.aside
                                className={styles.inlineSidebar}
                                initial={{ width: 0, opacity: 0, marginRight: 0 }}
                                animate={{ width: 320, opacity: 1, marginRight: 40 }}
                                exit={{ width: 0, opacity: 0, marginRight: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                            >
                                <div className={styles.inlineSidebarInner}>
                                    <SidebarContent 
                                        categories={categories}
                                        filter={filter}
                                        setFilter={setFilter}
                                        isDesktop={isDesktop}
                                        setIsFilterOpen={setIsFilterOpen}
                                    />
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    <div className={styles.gridSection}>
                        {/* 4. GRID ANIMADO */}
                        <AnimatedGrid 
                            key={viewMode}
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
                </div>

            </div>
        </main>
    );
}
