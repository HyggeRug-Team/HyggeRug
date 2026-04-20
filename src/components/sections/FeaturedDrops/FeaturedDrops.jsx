// Server Component — los datos se obtienen directamente de la BD en el servidor
import React from 'react';
import styles from './FeaturedDrops.module.css';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import { HiOutlinePlus } from 'react-icons/hi';
import { getProducts } from '@/lib/db/products';

/**
 * @file FeaturedDrops.jsx
 * @description Módulo de escaparate comercial para mostrar productos de catálogo en la Home.
 *
 * [Nuestro enfoque]
 * Despliega un grid (cuadrícula) estructurada con los productos activos extraídos de la
 * base de datos. Controla de forma nativa visuales como "SIN STOCK"
 * dependiente de la disponibilidad de materiales.
 *
 * [Por qué lo hemos hecho así]
 * La home page necesita trasladar al usuario al "modo compra" justo tras el impacto visual
 * del HeroSection. Mostrar el catálogo tempranamente agiliza la conversión en e-commerce.
 * El enlace a IG anclado al header mantiene la percepción comunitaria del proyecto.
 */
export default async function FeaturedDrops() {
    // Datos reales desde la base de datos (máximo 3 para la home)
    let drops = [];
    try {
        const products = await getProducts();
        drops = products.slice(0, 4);
    } catch (error) {
        console.error('FeaturedDrops: error al cargar productos', error);
    }

    return (
        <section className={styles.dropsWrapper} id="drops">
            <div className={styles.dropsContainer}>
                
                <div className={styles.sectionHeader}>
                    <div className={styles.titleGroup}>
                        <div className={styles.badgeGlow}>ÚLTIMOS AÑADIDOS AL CATÁLOGO</div>
                        <h2 className={styles.titleLoud}>ÚLTIMAS PIEZAS</h2>
                    </div>
                    <div className={styles.headerActions}>
                        <SecondaryButton 
                            text="VER CATÁLOGO COMPLETO" 
                            url="/tienda" 
                            className={styles.headerBtn} 
                            Icon={HiOutlinePlus}
                        />
                    </div>
                </div>

                <div className={styles.dropsGrid}>
                    {drops.length > 0 ? (
                        drops.map((drop) => (
                            <ProductCard
                                key={drop.product_id}
                                title={drop.name}
                                price={`${parseFloat(drop.base_price).toFixed(2)}€`}
                                status="DISPONIBLE"
                                image={drop.main_image ?? '/rug-mario.png'}
                                category=""
                            />
                        ))
                    ) : (
                        <p style={{ color: 'var(--color-muted, #888)', gridColumn: '1/-1' }}>
                            No hay productos disponibles en este momento.
                        </p>
                    )}
                </div>

                <div className={styles.footerActions}>
                    <a href="https://instagram.com/hygge_rug" className={styles.instaStroke}>IG/@HYGGE_RUG</a>
                </div>

            </div>
        </section>
    );
}
