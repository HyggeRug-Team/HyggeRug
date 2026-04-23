"use client";

/**
 * CLIENTE DE LA GALERÍA DE DISEÑOS DE LA COMUNIDAD
 * Gestiona la lógica de filtrado e inyecta los valores en los componentes genéricos puros.
 */
import React, { useState, useMemo } from 'react';
import HeroSplit from '@/components/sections/Shop/HeroSplit/HeroSplit';
import FloatingFilterBar from '@/components/sections/Shop/FloatingFilterBar/FloatingFilterBar';
import ResultsInfo from '@/components/sections/Shop/ResultsInfo/ResultsInfo';
import AnimatedGrid from '@/components/sections/Shop/AnimatedGrid/AnimatedGrid';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
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
                    p.name?.toLowerCase().includes(query) || 
                    p.description?.toLowerCase().includes(query);
                
                return matchesCategory && matchesSearch;
            });

        // Ajustamos la lógica de ordenación a los campos correctos (name, base_price)
        if (sort === 'LOW') {
            result.sort((a, b) => parseFloat(a.base_price) - parseFloat(b.base_price));
        } else if (sort === 'HIGH') {
            result.sort((a, b) => parseFloat(b.base_price) - parseFloat(a.base_price));
        }
        
        return result;
    }, [products, filter, searchQuery, sort]);

    return (
        <main className={styles.shopWrapper}>
            <div className={styles.shopContainer}>
                
                {/* 1. HERO DE SECCIÓN (INYECCIÓN DE VALORES) */}
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

                {/* 2. BARRA DE FILTROS (INYECCIÓN DE CONFIGURACIÓN) */}
                <FloatingFilterBar 
                    search={{
                        value: searchQuery,
                        onChange: setSearchQuery,
                        placeholder: "Buscar diseños comunitarios..."
                    }}
                    filters={{
                        options: categories,
                        active: filter,
                        onSelect: setFilter
                    }}
                    sort={{
                        options: [
                            { id: 'FEATURED', label: 'DESTACADOS' },
                            { id: 'LOW', label: 'PRECIO MIN' },
                            { id: 'HIGH', label: 'PRECIO MAX' }
                        ],
                        active: sort,
                        onSelect: setSort,
                        isOpen: isSortOpen,
                        onToggle: () => setIsSortOpen(!isSortOpen)
                    }}
                />

                {/* 3. INFO DE RESULTADOS (INYECCIÓN DE MENSAJES) */}
                <ResultsInfo 
                    message={searchQuery ? `Resultados para "${searchQuery}"` : `Mostrando ${filteredProducts.length} creaciones`}
                    subMessage={searchQuery ? "Explora lo que la comunidad ha diseñado" : "Inspiración directa de nuestros clientes"}
                />

                {/* 4. GRID ANIMADO (INYECCIÓN DE DATOS Y COMPONENTE) */}
                <AnimatedGrid 
                    items={filteredProducts} 
                    ItemComponent={ProductCard}
                />

            </div>
        </main>
    );
}
