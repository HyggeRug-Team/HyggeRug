/**
 * @file FeaturedDrops.jsx
 * @description Módulo de escaparate comercial para mostrar los diseños más recientes en la Home.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este componente para que actúe como una ventana directa a la 
 * actividad de nuestro taller. Obtenemos los productos dinámicamente desde el 
 * servidor para que la sección siempre refleje las últimas creaciones de la comunidad.
 * 
 * [Por qué lo hemos hecho así]
 * Queremos que el usuario sienta que la web está "viva". Al integrar datos reales 
 * y enlaces sociales centralizados, garantizamos que el flujo desde el interés visual 
 * hasta la compra o el seguimiento en redes sea lo más fluido posible.
 */
import React from 'react';
import styles from './FeaturedDrops.module.css';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import ProductCard from '@/components/ui/Cards/ProductCard/ProductCard';
import { HiOutlinePlus } from 'react-icons/hi';
import { getProducts } from '@/lib/db/products';
import { getWishlist } from '@/lib/db/wishlist';
import { getSession } from '@/lib/auth';
import { getConfigValues } from '@/lib/db/config';
export default async function FeaturedDrops() {
    const session = await getSession();
    let drops = [];
    let wishlistIds = new Set();
    let socialLinks = { social_instagram: "https://instagram.com/hygge_rug" };

    try {
        const [products, config] = await Promise.all([
            getProducts(),
            getConfigValues(['social_instagram'])
        ]);
        
        drops = products.slice(0, 4);
        if (config.social_instagram) socialLinks.social_instagram = config.social_instagram;

        if (session) {
            const wishlist = await getWishlist(session.userId);
            wishlistIds = new Set(wishlist.map(item => item.product_id));
        }
    } catch (error) {
        console.error('FeaturedDrops: error al cargar datos', error);
    }

    return (
        <section className={styles.dropsWrapper} id="drops">
            <div className={styles.dropsContainer}>
                
                <div className={styles.sectionHeader}>
                    <div className={styles.titleGroup}>
                        <div className={styles.badgeGlow}>ÚLTIMOS DISEÑOS DE LA COMUNIDAD</div>
                        <h2 className={styles.titleLoud}>IDEAS DE LA COMUNIDAD</h2>
                    </div>
                    <div className={styles.headerActions}>
                        <SecondaryButton 
                            text="DISEÑOS DE LA COMUNIDAD" 
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
                                id={drop.product_id}
                                title={drop.name}
                                description={drop.description}
                                price={`${parseFloat(drop.base_price).toFixed(2).replace('.', ',')}€`}
                                image={drop.main_image ?? '/rug-mario.png'}
                                category={drop.category}
                                initialIsFavorite={wishlistIds.has(drop.product_id)}
                            />
                        ))
                    ) : (
                        <p style={{ color: 'var(--color-muted, #888)', gridColumn: '1/-1' }}>
                            No hay productos disponibles en este momento.
                        </p>
                    )}
                </div>

                <div className={styles.footerActions}>
                    <a href={socialLinks.social_instagram} target="_blank" rel="noopener noreferrer" className={styles.instaStroke}>
                        IG/@HYGGE_RUG
                    </a>
                </div>

            </div>
        </section>
    );
}
