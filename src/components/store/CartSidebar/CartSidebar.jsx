"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaXmark, FaCartShopping, FaPlus, FaMinus } from 'react-icons/fa6';
import styles from './CartSidebar.module.css';

export default function CartSidebar({ isOpen, onClose }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/cart');
            if (!res.ok) return;
            const data = await res.json();
            setItems(data.items ?? []);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => fetchCart(), 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen, fetchCart]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Actualiza la cantidad de un item y sincroniza el estado local
    async function handleQuantityChange(orderProductId, newQuantity) {
        // Actualizar localmente primero para respuesta inmediata
        setItems(prev => prev.map(item =>
            item.order_product_id === orderProductId
                ? { ...item, quantity: newQuantity }
                : item
        ));

        await fetch('/api/cart/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderProductId, quantity: newQuantity }),
        });
    }

    // Elimina un item y lo quita del estado local
    async function handleRemove(orderProductId) {
        setItems(prev => prev.filter(item => item.order_product_id !== orderProductId));

        await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderProductId }),
        });
    }

    const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    const handleGoToCart = () => {
        onClose();
        router.push('/carrito');
    };

    return (
        <>
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={onClose}
            />

            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>

                {/* CABECERA */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <FaCartShopping />
                        <span>TU CESTA</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar cesta">
                        <FaXmark />
                    </button>
                </div>

                {/* LISTA DE ITEMS */}
                <div className={styles.body}>
                    {loading && (
                        <div className={styles.emptyState}>Cargando...</div>
                    )}

                    {!loading && items.length === 0 && (
                        <div className={styles.emptyState}>
                            <FaCartShopping size={32} opacity={0.2} />
                            <p>Tu cesta está vacía</p>
                        </div>
                    )}

                    {!loading && items.map((item) => (
                        <div key={item.order_product_id} className={styles.item}>

                            {/* X para eliminar — esquina superior derecha */}
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemove(item.order_product_id)}
                                aria-label="Eliminar producto"
                            >
                                <FaXmark />
                            </button>

                            {/* Imagen */}
                            <div className={styles.itemImage}>
                                <Image
                                    src={item.image_url ?? '/rug-mario.png'}
                                    alt={item.name}
                                    fill
                                    sizes="80px"
                                    className={styles.itemImg}
                                />
                            </div>

                            {/* Info */}
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.name}</span>
                                {item.size_label && (
                                    <span className={styles.itemSize}>{item.size_label}</span>
                                )}
                                <p className={styles.itemDesc}>
                                    {item.description?.slice(0, 60)}{item.description?.length > 60 ? '...' : ''}
                                </p>

                                {/* Controles de cantidad + precio */}
                                <div className={styles.itemFooter}>
                                    <div className={styles.qtyControls}>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => handleQuantityChange(item.order_product_id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            aria-label="Reducir cantidad"
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => handleQuantityChange(item.order_product_id, item.quantity + 1)}
                                            aria-label="Aumentar cantidad"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <span className={styles.itemPrice}>
                                        {(item.unit_price * item.quantity).toFixed(2)}€
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PIE */}
                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>TOTAL</span>
                            <span className={styles.totalAmount}>{total.toFixed(2)}€</span>
                        </div>
                        <button className={styles.goToCartBtn} onClick={handleGoToCart}>
                            IR AL CARRITO
                        </button>
                    </div>
                )}

            </aside>
        </>
    );
}