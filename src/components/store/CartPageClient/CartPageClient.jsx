"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaXmark, FaPlus, FaMinus, FaTag, FaLocationDot, FaCircleCheck, FaTriangleExclamation } from 'react-icons/fa6';
import styles from './CartPageClient.module.css';

export default function CartPageClient() {
    const router = useRouter();

    // Estado principal
    const [items, setItems]           = useState([]);
    const [addresses, setAddresses]   = useState([]);
    const [loading, setLoading]       = useState(true);

    // Estado del formulario
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [customerNote, setCustomerNote]       = useState('');
    const [discountCode, setDiscountCode]       = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null); // { code_id, discount_amount, ... }
    const [discountError, setDiscountError]     = useState('');
    const [discountLoading, setDiscountLoading] = useState(false);

    // Estado del modal de confirmación
    const [showModal, setShowModal]   = useState(false);
    const [confirming, setConfirming] = useState(false);

    // Carga inicial del carrito y direcciones
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [cartRes, addrRes] = await Promise.all([
                fetch('/api/cart'),
                fetch('/api/addresses'),
            ]);
            const cartData = await cartRes.json();
            const addrData = await addrRes.json();

            setItems(cartData.items ?? []);

            const addrList = Array.isArray(addrData) ? addrData : [];
            setAddresses(addrList);

            // Pre-seleccionar dirección por defecto si existe
            const defaultAddr = addrList.find(a => a.is_default) ?? addrList[0] ?? null;
            setSelectedAddress(defaultAddr?.address_id ?? null);
        } catch {
            setItems([]);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Actualizar cantidad de un item optimistamente
    async function handleQuantityChange(orderProductId, newQty) {
        setItems(prev => prev.map(i =>
            i.order_product_id === orderProductId ? { ...i, quantity: newQty } : i
        ));
        await fetch('/api/cart/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderProductId, quantity: newQty }),
        });
    }

    // Eliminar item optimistamente
    async function handleRemove(orderProductId) {
        setItems(prev => prev.filter(i => i.order_product_id !== orderProductId));
        if (appliedDiscount) setAppliedDiscount(null); // recalcular descuento
        await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderProductId }),
        });
    }

    // Validar código de descuento
    async function handleApplyDiscount() {
        if (!discountCode.trim()) return;
        setDiscountLoading(true);
        setDiscountError('');
        setAppliedDiscount(null);

        try {
            const res = await fetch('/api/cart/validate-discount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode.trim(), subtotal }),
            });
            const data = await res.json();

            if (!res.ok) {
                setDiscountError(data.error);
            } else {
                setAppliedDiscount(data);
            }
        } catch {
            setDiscountError('Error al validar el código');
        } finally {
            setDiscountLoading(false);
        }
    }

    // Confirmar pedido
    async function handleConfirm() {
        setConfirming(true);
        try {
            const res = await fetch('/api/cart/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: selectedAddress,
                    customerNote,
                    codeId: appliedDiscount?.code_id ?? null,
                    totalAmount: total,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error);
                return;
            }

            setShowModal(false);
            router.push('/dashboard'); // redirigir a panel de pedidos del usuario
        } catch {
            alert('Error al confirmar el pedido');
        } finally {
            setConfirming(false);
        }
    }

    // Cálculos del resumen
    const subtotal         = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const discountAmount   = appliedDiscount?.discount_amount ?? 0;
    const total            = Math.max(0, subtotal - discountAmount);
    const formatPrice      = (n) => `${parseFloat(n).toFixed(2)}€`;

    if (loading) {
        return <div className={styles.loadingState}>Cargando tu cesta...</div>;
    }

    return (
        <main className={styles.cartPage}>
            <div className={styles.cartContainer}>

                <h1 className={styles.pageTitle}>TU <span className={styles.titleAccent}>CESTA</span></h1>

                {items.length === 0 ? (
                    <div className={styles.emptyCart}>
                        <p>Tu cesta está vacía</p>
                        <button className={styles.shopBtn} onClick={() => router.push('/tienda')}>
                            VER DISEÑOS
                        </button>
                    </div>
                ) : (
                    <div className={styles.cartGrid}>

                        {/* ── COLUMNA IZQUIERDA ── */}
                        <div className={styles.leftCol}>

                            {/* Lista de items */}
                            <section className={styles.card}>
                                <h2 className={styles.cardTitle}>Productos ({items.length})</h2>
                                <div className={styles.itemList}>
                                    {items.map(item => (
                                        <div key={item.order_product_id} className={styles.item}>
                                            <div className={styles.itemImage}>
                                                <Image
                                                    src={item.image_url ?? '/rug-mario.png'}
                                                    alt={item.name}
                                                    fill
                                                    sizes="100px"
                                                    className={styles.itemImg}
                                                />
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemTop}>
                                                    <span className={styles.itemName}>{item.name}</span>
                                                    <button
                                                        className={styles.removeBtn}
                                                        onClick={() => handleRemove(item.order_product_id)}
                                                        aria-label="Eliminar"
                                                    >
                                                        <FaXmark />
                                                    </button>
                                                </div>
                                                {item.size_label && (
                                                    <span className={styles.itemSize}>{item.size_label}</span>
                                                )}
                                                <div className={styles.itemBottom}>
                                                    <div className={styles.qtyControls}>
                                                        <button
                                                            className={styles.qtyBtn}
                                                            onClick={() => handleQuantityChange(item.order_product_id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                                        <button
                                                            className={styles.qtyBtn}
                                                            onClick={() => handleQuantityChange(item.order_product_id, item.quantity + 1)}
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                    <span className={styles.itemPrice}>
                                                        {formatPrice(item.unit_price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Nota del cliente */}
                            <section className={styles.card}>
                                <h2 className={styles.cardTitle}>Nota para el pedido</h2>
                                <textarea
                                    className={styles.noteInput}
                                    placeholder="Instrucciones especiales, colores concretos, referencias..."
                                    value={customerNote}
                                    onChange={e => setCustomerNote(e.target.value)}
                                    rows={4}
                                />
                            </section>

                            {/* Código de descuento */}
                            <section className={styles.card}>
                                <h2 className={styles.cardTitle}><FaTag /> Código de descuento</h2>
                                <div className={styles.discountRow}>
                                    <input
                                        type="text"
                                        className={styles.discountInput}
                                        placeholder="HOLA10"
                                        value={discountCode}
                                        onChange={e => {
                                            setDiscountCode(e.target.value.toUpperCase());
                                            setDiscountError('');
                                            setAppliedDiscount(null);
                                        }}
                                        disabled={!!appliedDiscount}
                                    />
                                    <button
                                        className={styles.discountBtn}
                                        onClick={appliedDiscount ? () => { setAppliedDiscount(null); setDiscountCode(''); } : handleApplyDiscount}
                                        disabled={discountLoading}
                                    >
                                        {appliedDiscount ? 'QUITAR' : discountLoading ? '...' : 'APLICAR'}
                                    </button>
                                </div>
                                {discountError && (
                                    <p className={styles.discountError}>{discountError}</p>
                                )}
                                {appliedDiscount && (
                                    <p className={styles.discountSuccess}>
                                        <FaCircleCheck /> Descuento aplicado — {formatPrice(appliedDiscount.discount_amount)} menos
                                    </p>
                                )}
                            </section>
                        </div>

                        {/* ── COLUMNA DERECHA ── */}
                        <aside className={styles.rightCol}>

                            {/* Resumen de precios */}
                            <section className={styles.card}>
                                <h2 className={styles.cardTitle}>Resumen</h2>
                                <div className={styles.summaryRows}>
                                    <div className={styles.summaryRow}>
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    {appliedDiscount && (
                                        <div className={`${styles.summaryRow} ${styles.discountRow2}`}>
                                            <span>Descuento</span>
                                            <span>−{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className={styles.summaryRowNote}>
                                        <span>Envío</span>
                                        <span className={styles.pendingLabel}>A calcular</span>
                                    </div>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>TOTAL ESTIMADO</span>
                                    <span className={styles.totalAmount}>{formatPrice(total)}</span>
                                </div>
                                <p className={styles.totalNote}>El total final se confirmará tras la aprobación del pedido</p>
                            </section>

                            {/* Selector de dirección */}
                            <section className={styles.card}>
                                <h2 className={styles.cardTitle}><FaLocationDot /> Dirección de envío</h2>
                                {addresses.length === 0 ? (
                                    <p className={styles.noAddresses}>
                                        No tienes direcciones guardadas.{' '}
                                        <button className={styles.linkBtn} onClick={() => router.push('/dashboard')}>
                                            Añadir dirección
                                        </button>
                                    </p>
                                ) : (
                                    <div className={styles.addressList}>
                                        {addresses.map(addr => (
                                            <button
                                                key={addr.address_id}
                                                className={`${styles.addressCard} ${selectedAddress === addr.address_id ? styles.addressActive : ''}`}
                                                onClick={() => setSelectedAddress(addr.address_id)}
                                            >
                                                <div className={styles.addressRadio}>
                                                    <div className={styles.radioInner} />
                                                </div>
                                                <div className={styles.addressText}>
                                                    <span className={styles.addressStreet}>{addr.calle}{addr.portal_piso_puerta ? `, ${addr.portal_piso_puerta}` : ''}</span>
                                                    <span className={styles.addressCity}>{addr.codigo_postal} {addr.ciudad}, {addr.provincia}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Botón confirmar */}
                            <button
                                className={styles.confirmBtn}
                                onClick={() => setShowModal(true)}
                                disabled={!selectedAddress || items.length === 0}
                            >
                                CONFIRMAR ENCARGO
                            </button>

                        </aside>
                    </div>
                )}
            </div>

            {/* ── MODAL DE AVISO ── */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => !confirming && setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIcon}>
                            <FaTriangleExclamation />
                        </div>
                        <h3 className={styles.modalTitle}>Antes de confirmar</h3>
                        <p className={styles.modalText}>
                            Tu pedido pasará a <strong>pendiente de aprobación</strong>. La artesana revisará los detalles y se pondrá en contacto contigo antes de proceder con el cobro.
                        </p>
                        <p className={styles.modalText}>
                            Si tienes artículos personalizados en tu cesta, el proceso puede tardar unos días hasta que el diseño final sea acordado.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalCancel}
                                onClick={() => setShowModal(false)}
                                disabled={confirming}
                            >
                                VOLVER
                            </button>
                            <button
                                className={styles.modalConfirm}
                                onClick={handleConfirm}
                                disabled={confirming}
                            >
                                {confirming ? 'ENVIANDO...' : 'CONFIRMAR'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}