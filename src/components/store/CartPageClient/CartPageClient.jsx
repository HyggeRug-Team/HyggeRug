/**
 * @file CartPageClient.jsx
 * @description Página de carrito de compras del usuario (Client Component de hoja)
 *
 * [Nuestro enfoque]
 * Centraliza todo el estado interactivo del carrito: productos, cantidades, descuentos,
 * selección de dirección de envío y confirmación del pedido
 *
 * [Por qué lo hemos hecho así]
 * Al ser un Client Component de hoja, todo el estado de interacción vive aquí
 * mientras que la página padre puede seguir siendo un Server Component,
 * lo que mejora el rendimiento inicial de carga
 *
 * [Gestión de direcciones]
 * - Preselecciona automáticamente la dirección marcada como predeterminada
 * - Muestra de forma compacta la dirección activa con un botón de cambio
 * - Al pulsar "Cambiar" se expande la lista completa para elegir otra opción
 */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    FaXmark,
    FaPlus,
    FaMinus,
    FaTag,
    FaLocationDot,
    FaCircleCheck,
    FaTriangleExclamation,
    FaPencil,
    FaChevronLeft,
    FaHouse,
    FaPhone,
    FaCity,
    FaEarthEurope,
    FaEnvelopeOpenText,
    FaShieldHeart,
    FaTruckFast,
    FaPalette,
    FaClockRotateLeft,
} from 'react-icons/fa6';
import Link from 'next/link';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import TertiaryButton from '@/components/ui/Buttons/TertiaryButton/TertiaryButton';
import { useCart } from '@/context/CartContext';
import styles from './CartPageClient.module.css';

export default function CartPageClient() {
    const { refreshCartCount } = useCart();
    const router = useRouter();

    /* ── Estado principal ── */
    const [items, setItems]         = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading]     = useState(true);

    /* ── Estado del formulario ── */
    const [selectedAddress, setSelectedAddress]   = useState(null);
    const [customerNote, setCustomerNote]         = useState('');
    const [discountCode, setDiscountCode]         = useState('');
    const [appliedDiscount, setAppliedDiscount]   = useState(null);
    const [discountError, setDiscountError]       = useState('');
    const [discountLoading, setDiscountLoading]   = useState(false);

    /* Controla si la lista completa de direcciones está expandida o solo se ve la activa */
    const [showAddressList, setShowAddressList] = useState(false);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);

    /* ── Estado para nueva dirección ── */
    const [newAddress, setNewAddress] = useState({
        calle: '',
        portal_piso_puerta: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
        pais: 'España',
        phone_number: '',
        is_default: false
    });
    const [addressLoading, setAddressLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    /* ── Estado del modal de confirmación ── */
    const [showModal, setShowModal]   = useState(false);
    const [confirming, setConfirming] = useState(false);

    /* ── Carga inicial del carrito y las direcciones del usuario ── */
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

            /* Marcamos como seleccionada la dirección predeterminada, o la primera si no hay ninguna */
            const defaultAddr = addrList.find(a => a.is_default) ?? addrList[0] ?? null;
            setSelectedAddress(defaultAddr?.address_id ?? null);
            refreshCartCount();
        } catch {
            setItems([]);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    }, [refreshCartCount]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── Acciones del carrito ── */

    /**
     * Actualiza la cantidad de un producto de forma optimista:
     * primero refleja el cambio en la UI y luego lo persiste en el servidor
     *
     * @param {number} orderProductId - Identificador del producto en el pedido
     * @param {number} newQty - Nueva cantidad seleccionada por el usuario
     */
    async function handleQuantityChange(orderProductId, newQty) {
        setItems(prev => prev.map(i =>
            i.order_product_id === orderProductId ? { ...i, quantity: newQty } : i
        ));
        await fetch('/api/cart/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderProductId, quantity: newQty }),
        });
        refreshCartCount();
    }

    /**
     * Elimina un producto del carrito de forma optimista:
     * lo quita de la UI al instante y luego manda la petición al servidor
     *
     * @param {number} orderProductId - Identificador del producto a eliminar
     */
    async function handleRemove(orderProductId) {
        setItems(prev => prev.filter(i => i.order_product_id !== orderProductId));
        if (appliedDiscount) setAppliedDiscount(null); // recalcular descuento
        await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderProductId }),
        });
        refreshCartCount();
    }

    /**
     * Valida el código de descuento contra el servidor y lo aplica si es correcto
     * Si el código ya estaba aplicado no hace nada para evitar llamadas duplicadas
     */
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

    /* Envía el pedido al servidor y redirige al área de pedidos del dashboard si todo va bien */
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
            router.push('/dashboard/pedidos');
        } catch {
            alert('Error al confirmar el pedido. Inténtalo de nuevo.');
        } finally {
            setConfirming(false);
        }
    }

    /* Guarda la dirección elegida y colapsa la lista para volver a la vista compacta */
    const handleSelectAddress = (addressId) => {
        setSelectedAddress(addressId);
        setShowAddressList(false);
        setShowNewAddressForm(false);
    };

    /* Validar Formulario */
    const validateAddress = () => {
        const errors = {};
        if (newAddress.calle.length < 5) errors.calle = "Mínimo 5 caracteres";
        if (newAddress.ciudad.length < 2) errors.ciudad = "Ciudad no válida";
        if (!/^\d{5}$/.test(newAddress.codigo_postal)) errors.codigo_postal = "CP debe tener 5 dígitos";
        if (newAddress.provincia.length < 2) errors.provincia = "Provincia no válida";
        if (!/^[6789]\d{8}$/.test(newAddress.phone_number.replace(/\s/g, ''))) {
            errors.phone_number = "Teléfono no válido (9 dígitos)";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /* Crear nueva dirección */
    async function handleCreateAddress(e) {
        if (e) e.preventDefault();
        
        if (!validateAddress()) return;

        setAddressLoading(true);
        try {
            const res = await fetch('/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddress),
            });
            if (!res.ok) throw new Error('Error al crear dirección');
            const created = await res.json();
            
            setAddresses(prev => [...prev, created]);
            setSelectedAddress(created.address_id);
            setShowNewAddressForm(false);
            setShowAddressList(false);
            setFormErrors({});
            
            // Reset form
            setNewAddress({
                calle: '',
                portal_piso_puerta: '',
                ciudad: '',
                provincia: '',
                codigo_postal: '',
                pais: 'España',
                phone_number: '',
                is_default: false
            });
        } catch (err) {
            alert(err.message);
        } finally {
            setAddressLoading(false);
        }
    }

    /* ── Cálculos del resumen ── */
    const subtotal       = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const discountAmount = appliedDiscount?.discount_amount ?? 0;
    const total          = Math.max(0, subtotal - discountAmount);
    const formatPrice    = (n) => `${parseFloat(n).toFixed(2)}€`;

    /** Dirección actualmente seleccionada (objeto completo) */
    const activeAddress = addresses.find(a => a.address_id === selectedAddress) ?? null;

    if (loading) {
        return <div className={styles.loadingState}>Cargando tu cesta...</div>;
    }

    return (
        <main className={styles.cartPage}>
            <div className={styles.cartContainer}>

                <div className={styles.headerTop}>
                    <Link href="/tienda" className={styles.backBtn}>
                        <FaChevronLeft /> Volver a la tienda
                    </Link>
                </div>

                <h1 className={styles.pageTitle}>
                    TU <span className={styles.titleAccent}>CESTA</span>
                    {items.length > 0 && <span className={styles.itemCountBadge}>{items.length} {items.length === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}</span>}
                </h1>

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
                                <div className={styles.cardTitle}>01. PRODUCTOS ({items.length})</div>
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
                                                        aria-label="Eliminar producto del carrito"
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
                                    <PrimaryButton 
                                        text={appliedDiscount ? 'QUITAR' : discountLoading ? '...' : 'APLICAR'}
                                        onClick={appliedDiscount
                                            ? () => { setAppliedDiscount(null); setDiscountCode(''); }
                                            : handleApplyDiscount
                                        }
                                        disabled={discountLoading}
                                        className={styles.discountActionBtn}
                                    />
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
                                        <button className={styles.linkBtn} onClick={() => router.push('/dashboard/direcciones')}>
                                            Añadir dirección
                                        </button>
                                    </p>
                                ) : (
                                    <>
                                        {/* Vista compacta: dirección activa + botón "Cambiar" */}
                                        {activeAddress && !showAddressList && !showNewAddressForm && (
                                            <div className={styles.addressDisplayCard}>
                                                <div className={styles.addressCardHeader}>
                                                    <span className={styles.statusLabel}>
                                                        {activeAddress.is_default ? '★ DIRECCIÓN PREDETERMINADA' : 'DIRECCIÓN SELECCIONADA'}
                                                    </span>
                                                    <button 
                                                        className={styles.editAddressLink}
                                                        onClick={() => setShowAddressList(true)}
                                                    >
                                                        <FaPencil /> CAMBIAR
                                                    </button>
                                                </div>
                                                <div className={styles.addressInfoBox}>
                                                    <p className={styles.streetLine}>
                                                        {activeAddress.calle}
                                                        {activeAddress.portal_piso_puerta && <span className={styles.extraInfo}>, {activeAddress.portal_piso_puerta}</span>}
                                                    </p>
                                                    <p className={styles.cityLine}>
                                                        {activeAddress.codigo_postal} {activeAddress.ciudad}, {activeAddress.provincia}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Lista expandida para cambiar dirección */}
                                        {showAddressList && !showNewAddressForm && (
                                            <div className={styles.addressList}>
                                                {addresses.map(addr => (
                                                    <button
                                                        key={addr.address_id}
                                                        className={`${styles.addressCard} ${selectedAddress === addr.address_id ? styles.addressActive : ''}`}
                                                        onClick={() => handleSelectAddress(addr.address_id)}
                                                    >
                                                        <div className={styles.addressRadio}>
                                                            <div className={styles.radioInner} />
                                                        </div>
                                                        <div className={styles.addressText}>
                                                            <span className={styles.addressStreet}>
                                                                {addr.calle}{addr.portal_piso_puerta ? `, ${addr.portal_piso_puerta}` : ''}
                                                            </span>
                                                            <span className={styles.addressCity}>
                                                                {addr.codigo_postal} {addr.ciudad}, {addr.provincia}
                                                            </span>
                                                            {addr.is_default && (
                                                                <span className={styles.defaultBadge}>Predeterminada</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                                <div className={styles.addNewAddrWrapper}>
                                                    <TertiaryButton 
                                                        text="Añadir nueva dirección"
                                                        onClick={() => setShowNewAddressForm(true)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Formulario nueva dirección */}
                                        {showNewAddressForm && (
                                            <form className={styles.newAddressForm} onSubmit={handleCreateAddress}>
                                                <div className={styles.formGrid}>
                                                    <div className={styles.formGroup}>
                                                        <label><FaHouse /> Calle y número</label>
                                                        <input 
                                                            required
                                                            type="text" 
                                                            placeholder="Ej. Calle Mayor 123"
                                                            value={newAddress.calle}
                                                            className={formErrors.calle ? styles.inputError : ''}
                                                            onChange={e => {
                                                                setNewAddress({...newAddress, calle: e.target.value});
                                                                if (formErrors.calle) setFormErrors({...formErrors, calle: null});
                                                            }}
                                                        />
                                                        {formErrors.calle && <span className={styles.errorMsg}>{formErrors.calle}</span>}
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label><FaEnvelopeOpenText /> Portal, piso...</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Ej. 2ºB"
                                                            value={newAddress.portal_piso_puerta}
                                                            onChange={e => setNewAddress({...newAddress, portal_piso_puerta: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className={styles.formRow}>
                                                        <div className={styles.formGroup}>
                                                            <label><FaCity /> Ciudad</label>
                                                            <input 
                                                                required
                                                                type="text" 
                                                                placeholder="Madrid"
                                                                value={newAddress.ciudad}
                                                                className={formErrors.ciudad ? styles.inputError : ''}
                                                                onChange={e => {
                                                                    setNewAddress({...newAddress, ciudad: e.target.value});
                                                                    if (formErrors.ciudad) setFormErrors({...formErrors, ciudad: null});
                                                                }}
                                                            />
                                                            {formErrors.ciudad && <span className={styles.errorMsg}>{formErrors.ciudad}</span>}
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <label>C.P.</label>
                                                            <input 
                                                                required
                                                                type="text" 
                                                                placeholder="28001"
                                                                value={newAddress.codigo_postal}
                                                                className={formErrors.codigo_postal ? styles.inputError : ''}
                                                                onChange={e => {
                                                                    setNewAddress({...newAddress, codigo_postal: e.target.value});
                                                                    if (formErrors.codigo_postal) setFormErrors({...formErrors, codigo_postal: null});
                                                                }}
                                                            />
                                                            {formErrors.codigo_postal && <span className={styles.errorMsg}>{formErrors.codigo_postal}</span>}
                                                        </div>
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label><FaEarthEurope /> Provincia</label>
                                                        <input 
                                                            required
                                                            type="text" 
                                                            placeholder="Madrid"
                                                            value={newAddress.provincia}
                                                            className={formErrors.provincia ? styles.inputError : ''}
                                                            onChange={e => {
                                                                setNewAddress({...newAddress, provincia: e.target.value});
                                                                if (formErrors.provincia) setFormErrors({...formErrors, provincia: null});
                                                            }}
                                                        />
                                                        {formErrors.provincia && <span className={styles.errorMsg}>{formErrors.provincia}</span>}
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label><FaPhone /> Teléfono</label>
                                                        <input 
                                                            required
                                                            type="tel" 
                                                            placeholder="600 000 000"
                                                            value={newAddress.phone_number}
                                                            className={formErrors.phone_number ? styles.inputError : ''}
                                                            onChange={e => {
                                                                setNewAddress({...newAddress, phone_number: e.target.value});
                                                                if (formErrors.phone_number) setFormErrors({...formErrors, phone_number: null});
                                                            }}
                                                        />
                                                        {formErrors.phone_number && <span className={styles.errorMsg}>{formErrors.phone_number}</span>}
                                                    </div>
                                                </div>
                                                <div className={styles.formActions}>
                                                    <SecondaryButton 
                                                        text="CANCELAR"
                                                        onClick={() => setShowNewAddressForm(false)}
                                                        className={styles.formActionBtn}
                                                    />
                                                    <SecondaryButton 
                                                        text="GUARDAR Y USAR"
                                                        onClick={handleCreateAddress}
                                                        variant="whitePink"
                                                        className={styles.formActionBtn}
                                                        disabled={addressLoading}
                                                    />
                                                </div>
                                            </form>
                                        )}
                                    </>
                                )}
                            </section>

                            {/* Botón confirmar */}
                            <SecondaryButton 
                                text="CONFIRMAR ENCARGO"
                                onClick={() => setShowModal(true)}
                                disabled={!selectedAddress || items.length === 0}
                                className={styles.confirmBtnFull}
                            />

                            <div className={styles.trustBadges}>
                                <div className={styles.trustItem}>
                                    <FaShieldHeart />
                                    <span>Pago 100% Seguro</span>
                                </div>
                                <div className={styles.trustItem}>
                                    <FaTruckFast />
                                    <span>Envío Asegurado</span>
                                </div>
                                <div className={styles.trustItem}>
                                    <FaPalette />
                                    <span>Artesanía Real</span>
                                </div>
                            </div>

                        </aside>
                    </div>
                )}
            </div>

            {/* ── MODAL DE AVISO (PREMIUM) ── */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => !confirming && setShowModal(false)}>
                    <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIconBox}>
                            <FaTriangleExclamation className={styles.modalIconWarn} />
                        </div>
                        <h3 className={styles.modalTitle}>Antes de confirmar</h3>
                        
                        <div className={styles.modalBody}>
                            <p className={styles.modalMainText}>
                                Tu pedido pasará a <span className={styles.accentText}>pendiente de aprobación</span>. La artesana revisará los detalles y se pondrá en contacto contigo antes de proceder con el cobro.
                            </p>
                            
                            <div className={styles.infoNote}>
                                <FaPalette />
                                <p>
                                    Si tienes artículos personalizados en tu cesta, el proceso puede tardar unos días hasta que el diseño final sea acordado.
                                </p>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
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