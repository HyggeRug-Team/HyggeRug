"use client";
import React, { useState } from 'react';
import styles from './product.module.css';

import ProductHeader from '@/components/store/ProductDetail/ProductHeader';
import ProductGallery from '@/components/store/ProductDetail/ProductGallery';
import ProductDescription from '@/components/store/ProductDetail/ProductDescription';
import ProductPrice from '@/components/store/ProductDetail/ProductPrice';
import ProductSizeSelector from '@/components/store/ProductDetail/ProductSizeSelector';
import ProductBuyActions from '@/components/store/ProductDetail/ProductBuyActions';
import CartSidebar from '@/components/store/cart/CartSidebar/CartSidebar';
import ProductReviews from '@/components/store/ProductDetail/ProductReviews';

export default function ProductDetailClient({ product }) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [quantity, setQuantity]         = useState(1);
    const [cartOpen, setCartOpen]         = useState(false);
    const [pendingItem, setPendingItem]   = useState(null);

    return (
        <main className={styles.productWrapper}>
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => { setCartOpen(false); setPendingItem(null); }}
                pendingItem={pendingItem}
            />

            <div className={styles.productContainer}>

                <div className={styles.heroSection}>
                    <ProductHeader product={product} />

                    <div className={styles.mainGrid}>
                        {/* COLUMNA IZQUIERDA: VISUAL */}
                        <section className={styles.visualCol}>
                            <ProductGallery product={product} />
                        </section>

                        {/* COLUMNA DERECHA: COMPRA (STICKY) */}
                        <aside className={styles.purchaseCol}>
                            <div className={styles.purchaseCard}>

                                <ProductPrice
                                    basePrice={product.basePrice}
                                    selectedSizePrice={selectedSize?.price ?? null}
                                />

                                <ProductSizeSelector
                                    sizes={product.sizes || []}
                                    selectedSize={selectedSize}
                                    setSelectedSize={setSelectedSize}
                                />

                                <ProductBuyActions
                                    productId={product.id}
                                    productName={product.name}
                                    productImage={product.image}
                                    selectedSize={selectedSize}
                                    basePrice={product.basePrice}
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                    onAddSuccess={(item) => {
                                        setPendingItem(item);
                                        setCartOpen(true);
                                    }}
                                />

                            </div>
                        </aside>
                    </div>
                </div>

                {/* FILA INFERIOR: DESCRIPCIÓN */}
                <div className={styles.descriptionSection}>
                    <ProductDescription description={product.description} />
                </div>

                {/* FILA EXTRA: VALORACIONES */}
                <ProductReviews reviews={product.reviews} />
            </div>
        </main>
    );
}