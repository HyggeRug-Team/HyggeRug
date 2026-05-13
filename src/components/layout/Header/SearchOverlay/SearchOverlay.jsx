/**
 * @file SearchOverlay.jsx
 * @description Buscador global del sitio que combina productos y páginas estáticas.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este buscador como un "centro de mandos" rápido. No solo busca alfombras,
 * sino que ayuda al usuario a encontrar secciones importantes como el contacto o su cuenta.
 * 
 * [Por qué lo hemos hecho así]
 * Queríamos que la navegación fuera fluida, por lo que hemos aplicado un buscador tipo
 * "command palette" que se siente moderno y ligero, evitando que el usuario se pierda.
 */
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaMagnifyingGlass, 
    FaXmark, 
    FaHouse, 
    FaStore, 
    FaPaintbrush, 
    FaUser, 
    FaCircleInfo, 
    FaEnvelope, 
    FaCircleQuestion,
    FaCartShopping
} from 'react-icons/fa6';
import Link from 'next/link';
import styles from './SearchOverlay.module.css';

const PAGES = [
    { name: 'Inicio', url: '/', description: 'Página principal de Hygge Rug', icon: FaHouse },
    { name: 'Comunidad', url: '/tienda', description: 'Explora los diseños de la comunidad', icon: FaStore },
    { name: 'Personalizar', url: '/personalizar', description: 'Crea tu propia alfombra a medida', icon: FaPaintbrush },
    { name: 'Sobre Nosotros', url: '/sobre-nosotros', description: 'Conoce al equipo detrás del taller', icon: FaCircleInfo },
    { name: 'Contacto', url: '/contacto', description: 'Escríbenos para cualquier duda o colaboración', icon: FaEnvelope },
    { name: 'Preguntas Frecuentes', url: '/preguntas-frecuentes', description: 'Resolvemos tus dudas sobre envíos y procesos', icon: FaCircleQuestion },
    { name: 'Carrito', url: '/carrito', description: 'Gestiona tus productos seleccionados', icon: FaCartShopping },
    { name: 'Mi Cuenta / Acceso', url: '/auth', description: 'Entra a tu perfil de cliente', icon: FaUser },
];

export default function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [productResults, setProductResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Filtrado de páginas estáticas
    const pageResults = useMemo(() => {
        if (query.trim().length < 2) return [];
        return PAGES.filter(page => 
            page.name.toLowerCase().includes(query.toLowerCase()) || 
            page.description.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setProductResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                try {
                    const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setProductResults(data.products || []);
                } catch (error) {
                    console.error("Search error:", error);
                    setProductResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setProductResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const hasAnyResults = pageResults.length > 0 || productResults.length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <div className={styles.searchWrapper}>
                        <motion.div 
                            className={styles.searchContainer}
                            initial={{ y: -40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.searchHeader}>
                                <FaMagnifyingGlass className={styles.searchIcon} />
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    placeholder="Busca productos, páginas, ayuda..." 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className={styles.searchInput}
                                />
                                {loading && <div className={styles.loader} />}
                                <button className={styles.closeBtn} onClick={onClose}>
                                    <FaXmark size={18} />
                                </button>
                            </div>

                            <div className={styles.resultsArea}>
                                {query.length > 0 && query.length < 2 && (
                                    <p className={styles.hint}>Escribe al menos 2 letras para empezar...</p>
                                )}



                                {pageResults.length > 0 && (
                                    <div className={styles.section}>
                                        <span className={styles.sectionTitle}>Páginas del sitio</span>
                                        <div className={styles.grid}>
                                            {pageResults.map(page => {
                                                const Icon = page.icon;
                                                return (
                                                    <Link 
                                                        href={page.url} 
                                                        key={page.url} 
                                                        className={styles.pageItem}
                                                        onClick={onClose}
                                                    >
                                                        <div className={styles.pageIcon}><Icon size={18} /></div>
                                                        <div className={styles.pageInfo}>
                                                            <h3>{page.name}</h3>
                                                            <p>{page.description}</p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {productResults.length > 0 && (
                                    <div className={styles.section}>
                                        <span className={styles.sectionTitle}>Diseños encontrados</span>
                                        <div className={styles.grid}>
                                            {productResults.map(product => (
                                                <Link 
                                                    href={`/tienda/${product.product_id}`} 
                                                    key={product.product_id}
                                                    className={styles.productItem}
                                                    onClick={onClose}
                                                >
                                                    <img src={product.image_url} alt={product.name} className={styles.productThumb} />
                                                    <div className={styles.productInfo}>
                                                        <h3>{product.name}</h3>
                                                        <p>{product.base_price}€</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {query.length >= 2 && !loading && !hasAnyResults && (
                                    <p className={styles.noResults}>No hemos encontrado nada para "{query}"</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
