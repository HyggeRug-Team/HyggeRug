/**
 * @file FeaturedDrops.jsx
 * @description Módulo de escaparate comercial para mostrar productos de catálogo en la Home.
 *
 * [Nuestro enfoque]
 * Despliega un grid (cuadrícula) estructurada con productos de prueba (drops array) que 
 * simulan extracciones de base de datos. Controla de forma nativa visuales como "SIN STOCK" 
 * dependiente de la disponibilidad de materiales.
 *
 * [Por qué lo hemos hecho así]
 * La home page necesita trasladar al usuario al "modo compra" justo tras el impacto visual 
 * del HeroSection. Mostrar el catálogo tempranamente agiliza la conversión en e-commerce. 
 * El enlace a IG anclado al header mantiene la percepción comunitaria del proyecto.
 */
"use client";
import React from 'react';
import styles from './FeaturedDrops.module.css';
import Image from 'next/image';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';

export default function FeaturedDrops() {
    // Array simulado del Catálogo / BBDD
    const drops = [
        { id: 1, title: 'AKATSUKI CLOUD', price: '90€', status: 'DISPONIBLE', img: '/rug-mario.png', badge: 'ANIME / MANGA' },
        { id: 2, title: 'SMILEY Y2K', price: '120€', status: 'DISPONIBLE', img: '/rug-shield.png', badge: 'ESTÉTICA Y2K' },
        { id: 3, title: 'WAVY CHECKER', price: '150€', status: 'SIN STOCK', img: '/modern-detail.png', badge: 'ABSTRACTO' },
        { id: 4, title: 'CUSTOM ORDER', price: 'A Medida', status: 'DISPONIBLE', img: '/rug-gorillaz.png', badge: 'PERSONALIZADO' },
    ];

    return (
        <section className={styles.dropsWrapper} id="drops">
            {/* SVG Filter for Tufting Rough Edges */}
            <svg width="0" height="0" style={{ position: 'absolute', zIndex: -1 }}>
                <filter id="tuftingEdge">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            <div className={styles.dropsContainer}>
                
                <div className={styles.sectionHeader}>
                    <div className={styles.titleGroup}>
                        <div className={styles.badgeGlow}>ÚLTIMOS AÑADIDOS AL CATÁLOGO</div>
                        <h2 className={styles.titleLoud}>ÚLTIMAS PIEZAS</h2>
                    </div>
                    <div className={styles.headerActions}>
                        <PrimaryButton text="VER CATÁLOGO COMPLETO" url="/tienda" className={styles.headerBtn} />
                    </div>
                </div>

                <div className={styles.dropsGrid}>
                    {drops.map((drop) => (
                        <div key={drop.id} className={styles.dropCard}>
                            <div className={styles.cardBadge}>{drop.badge}</div>
                            <div className={styles.imageBox}>
                                <Image 
                                    src={drop.img} 
                                    alt={drop.title} 
                                    fill 
                                    className={styles.image} 
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                {drop.status === 'SIN STOCK' && (
                                    <div className={styles.soldOutOverlay}>SIN STOCK</div>
                                )}
                            </div>
                            <div className={styles.cardInfo}>
                                <h3>{drop.title}</h3>
                                <div className={styles.priceRow}>
                                    <span className={styles.price}>{drop.price}</span>
                                    <span className={`${styles.status} ${drop.status !== 'DISPONIBLE' ? styles.statusClosed : ''}`}>
                                        {drop.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footerActions}>
                    <a href="https://instagram.com/hygge_rug" className={styles.instaStroke}>IG/@HYGGE_RUG</a>
                </div>

            </div>
        </section>
    );
}
