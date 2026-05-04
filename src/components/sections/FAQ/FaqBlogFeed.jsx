/**
 * @file FaqBlogFeed.jsx
 * @description Componente cliente que gestiona la búsqueda y el feed de preguntas frecuentes.
 *
 * [Nuestro enfoque]
 * Separamos la lógica de búsqueda y filtrado en este componente cliente para permitir 
 * que la página principal (Server Component) gestione los metadatos SEO.
 *
 * [Por qué lo hemos hecho así]
 * Las FAQ son vitales para el SEO de "long-tail". Al usar Framer Motion para el filtrado, 
 * necesitamos el lado del cliente, pero queremos que los buscadores vean la estructura inicial.
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/app/(main)/preguntas-frecuentes/Preguntas.module.css';
import { FaSearch } from 'react-icons/fa';

export default function FaqBlogFeed({ faqs }) {
    const [search, setSearch] = useState('');

    const filteredFaqs = faqs.filter(faq => 
        faq.q.toLowerCase().includes(search.toLowerCase()) || 
        faq.cat.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.faqWrapper}>
            <div className={styles.container}>
                
                {/* CABECERA BLOG */}
                <header className={styles.header}>
                    <div className={styles.badgeGlow}>CENTRO DE AYUDA</div>
                    <h1 className={styles.titleLoud}>PREGUNTAS <br/> FRECUENTES</h1>
                </header>

                {/* BUSCADOR BRUTALISTA */}
                <div className={styles.searchContainer}>
                    <input 
                        type="text" 
                        className={styles.searchBar} 
                        placeholder="Busca por palabras clave (ej: limpieza, envíos...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* FEED DE ARTÍCULOS */}
                <div className={styles.faqFeed}>
                    <AnimatePresence mode="popLayout">
                        {filteredFaqs.map((faq) => (
                            <motion.article 
                                key={faq.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={styles.faqArticle}
                            >
                                <div className={styles.articleMeta}>
                                    <span className={styles.categoryTag}>{faq.cat}</span>
                                    <span className={styles.date}>{faq.date}</span>
                                </div>
                                <h2 className={styles.articleTitle}>{faq.q}</h2>
                                <p className={styles.articleContent}>{faq.a}</p>
                            </motion.article>
                        ))}
                    </AnimatePresence>

                    {filteredFaqs.length === 0 && (
                        <div className={styles.noResults}>
                            <p>No hemos encontrado nada para "{search}". Prueba con otra palabra.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
