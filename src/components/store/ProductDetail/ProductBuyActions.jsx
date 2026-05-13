"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import styles from './product.module.css';
import { useCart } from '@/context/CartContext';

/**
 * Controles de cantidad y botón de añadir a la cesta.
 * @param {number}      productId    - ID del producto
 * @param {object|null} selectedSize - Talla seleccionada { id, label, price }
 * @param {number}      quantity     - Cantidad actual
 * @param {Function}    setQuantity  - Setter del estado de cantidad
 */
export default function ProductBuyActions({ productId, productName, productImage, selectedSize, basePrice, quantity, setQuantity, onAddSuccess }) {
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error' | 'no-size'
    const { refreshCartCount } = useCart();
    const router = useRouter();

    async function handleAdd() {
        if (!selectedSize) {
            setStatus('no-size');
            setTimeout(() => setStatus('idle'), 2000);
            return;
        }

        setStatus('loading');

        const finalPrice = selectedSize.price ?? basePrice;
        const payload = {
            productId,
            sizeId: selectedSize.id,
            unitPrice: finalPrice,
            quantity: Number(quantity),
        };

        if (selectedSize.customMeasure) {
            payload.customSizeLabel = selectedSize.customMeasure;
        }

        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                router.push('/auth');
                return;
            }

            if (!res.ok) throw new Error('Failed');

            setStatus('success');

            // Abre el sidebar DESPUÉS de que el item ya está guardado en BD
            // y pasa los datos del item para mostrarlo inmediatamente
                            onAddSuccess?.({
                                order_product_id: `pending-${Date.now()}`,
                                name: productName,
                                image_url: productImage,
                                size_label: selectedSize.label ?? null,
                                unit_price: finalPrice,
                                quantity: Number(quantity),
                            });
                
                            refreshCartCount();
                            router.refresh();
        } catch {
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 2000);
        }
    }

    // Texto del botón según el estado actual
    const buttonLabel = {
        idle: 'AÑADIR A LA CESTA',
        loading: 'AÑADIENDO...',
        success: '✓ AÑADIDO',
        error: 'ERROR — REINTENTAR',
        'no-size': 'ELIGE UN TAMAÑO',
    }[status];

    return (
        <div className={styles.buyActions}>
            <div className={styles.quantityWrapper}>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className={styles.quantityInput}
                    disabled={status === 'loading'}
                />
            </div>
            <div className={styles.buttonWrapper}>
                <SecondaryButton
                    text={buttonLabel}
                    onClick={handleAdd}
                    disabled={status === 'loading'}
                />
            </div>
        </div>
    );
}