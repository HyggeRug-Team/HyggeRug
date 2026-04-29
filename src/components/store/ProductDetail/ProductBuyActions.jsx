"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import styles from './product.module.css';

/**
 * Controles de cantidad y botón de añadir a la cesta.
 * @param {number}      productId    - ID del producto
 * @param {object|null} selectedSize - Talla seleccionada { id, label, price }
 * @param {number}      quantity     - Cantidad actual
 * @param {Function}    setQuantity  - Setter del estado de cantidad
 */
export default function ProductBuyActions({ productId, selectedSize, quantity, setQuantity }) {
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error' | 'no-size'
    const router = useRouter();

    async function handleAdd() {
        // Validar que se haya seleccionado una talla antes de añadir
        if (!selectedSize) {
            setStatus('no-size');
            setTimeout(() => setStatus('idle'), 2000);
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    sizeId:    selectedSize.id,
                    unitPrice: selectedSize.price,
                    quantity:  Number(quantity),
                }),
            });

            if (res.status === 401) {
                // Usuario no autenticado: redirigir al login
                router.push('/auth');
                return;
            }

            if (!res.ok) throw new Error('Failed');

            setStatus('success');
            // Refrescar para que el servidor actualice cualquier dato (ej: contador de carrito futuro)
            router.refresh();
        } catch {
            setStatus('error');
        } finally {
            // Volver al estado normal tras 2 segundos si no fue redirect
            setTimeout(() => setStatus('idle'), 2000);
        }
    }

    // Texto del botón según el estado actual
    const buttonLabel = {
        idle:      'AÑADIR A LA CESTA',
        loading:   'AÑADIENDO...',
        success:   '✓ AÑADIDO',
        error:     'ERROR — REINTENTAR',
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