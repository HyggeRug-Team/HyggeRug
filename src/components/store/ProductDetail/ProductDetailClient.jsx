"use client";
import React, { useState } from 'react';
import styles from './product.module.css';

import ProductHeader from '@/components/store/ProductDetail/ProductHeader';
import ProductGallery from '@/components/store/ProductDetail/ProductGallery';
import ProductDescription from '@/components/store/ProductDetail/ProductDescription';
import ProductPrice from '@/components/store/ProductDetail/ProductPrice';
import ProductSizeSelector from '@/components/store/ProductDetail/ProductSizeSelector';
import ProductBuyActions from '@/components/store/ProductDetail/ProductBuyActions';

export default function ProductDetailClient({ product }) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [quantity, setQuantity] = useState(1);


    return (
        <main className={styles.productWrapper}>
            <div className={styles.productContainer}>

                <ProductHeader product={product} />

                <div className={styles.mainGrid}>

                    {/* COLUMNA IZQUIERDA: VISUAL */}
                    <section className={styles.visualCol}>
                        <ProductGallery product={product} />
                        <ProductDescription description={product.description} />
                    </section>

                    {/* COLUMNA DERECHA: COMPRA (STICKY) */}
                    <aside className={styles.purchaseCol}>
                        <div className={styles.purchaseCard}>

                            <ProductPrice
                                basePrice={product.basePrice}
                                selectedSizePrice={selectedSize?.price}
                            />

                            <ProductSizeSelector
                                sizes={product.sizes || []}
                                selectedSize={selectedSize}
                                setSelectedSize={setSelectedSize}
                            />

                            <ProductBuyActions
                                productId={product.id}
                                selectedSize={selectedSize}
                                quantity={quantity}
                                setQuantity={setQuantity}
                            />

                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}