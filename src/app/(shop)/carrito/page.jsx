/**
 * @file page.jsx
 * @description Página principal del carrito de compras.
 * Gestiona el estado de productos, direcciones, cupones y confirmación de pedido.
 * 
 * [Nuestro enfoque]
 * Centralizamos la lógica de negocio en este archivo para que los componentes 
 * de interfaz se mantengan sencillos y enfocados únicamente en mostrar datos.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Adaptabilidad: Separamos la lógica de la vista táctil y de escritorio para 
 *    ofrecer una navegación fluida en cualquier dispositivo.
 * 2. Estructura: En móviles, usamos una disposición vertical clara que guía al 
 *    usuario hasta el botón de compra final.
 * 3. Interactividad: Añadimos transiciones suaves para mejorar la experiencia 
 *    de usuario y la percepción de calidad.
 * 
 * @module CartPage
 */

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft } from 'react-icons/fa6';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { motion, AnimatePresence } from 'framer-motion';


// Componentes UI Reutilizables
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';

// Estilos de la Página
import styles from './carrito.module.css';

// Subcomponentes Modulares (Organizados en carpetas individuales)
import CartItemList from '@/components/store/cart/CartItemList/CartItemList';
import CartSummary from '@/components/store/cart/CartSummary/CartSummary';
import AddressSection from '@/components/store/cart/AddressSection/AddressSection';
import DiscountSection from '@/components/store/cart/DiscountSection/DiscountSection';
import CartModal from '@/components/store/cart/CartModal/CartModal';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';

export default function CartPage() {
    /* ── HOOKS & CONTEXTO ── */
    const { refreshCartCount } = useCart();
    const router = useRouter();
    const isTouch = useIsTouchDevice();


    /* ── ESTADO GLOBAL DE DATOS ── */
    const [items, setItems]         = useState([]);       // Productos en el carrito
    const [addresses, setAddresses] = useState([]);       // Direcciones del usuario
    const [loading, setLoading]     = useState(true);      // Estado de carga inicial

    /* ── ESTADO DE NEGOCIO / FORMULARIO ── */
    const [selectedAddress, setSelectedAddress]   = useState(null);  // ID de dirección seleccionada
    const [customerNote, setCustomerNote]         = useState('');    // Nota opcional del pedido
    const [discountCode, setDiscountCode]         = useState('');    // Código introducido por el usuario
    const [appliedDiscount, setAppliedDiscount]   = useState(null);  // Cupón validado con éxito
    const [discountError, setDiscountError]       = useState('');    // Error de validación de cupón
    const [discountLoading, setDiscountLoading]   = useState(false); // Cargando validación

    /* ── ESTADO DE UI ── */
    const [showAddressList, setShowAddressList] = useState(false);   // Alternar entre dirección activa y lista
    const [showNewAddressForm, setShowNewAddressForm] = useState(false); // Formulario de nueva dirección
    const [showModal, setShowModal]   = useState(false);             // Modal de confirmación final
    const [confirming, setConfirming] = useState(false);             // Procesando el pedido
    const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    /* ── ESTADO PARA NUEVA DIRECCIÓN ── */
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

    /**
     * Carga inicial de datos desde la API.
     * Incluye verificación de sesión (redirección a /auth si falla).
     */
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [cartRes, addrRes] = await Promise.all([
                fetch('/api/cart'),
                fetch('/api/addresses'),
            ]);
            
            // Verificación de autorización
            if (cartRes.status === 401 || addrRes.status === 401) {
                router.push('/auth');
                return;
            }

            const cartData = await cartRes.json();
            const addrData = await addrRes.json();

            setItems(cartData.items ?? []);

            const addrList = Array.isArray(addrData) ? addrData : [];
            setAddresses(addrList);

            // Selección inicial de dirección (predeterminada o primera disponible)
            const defaultAddr = addrList.find(a => a.is_default) ?? addrList[0] ?? null;
            setSelectedAddress(defaultAddr?.address_id ?? null);
            
            refreshCartCount();
        } catch (error) {
            console.error("Error fetching cart data:", error);
            setItems([]);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    }, [refreshCartCount, router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── MANEJADORES DE ACCIONES ── */

    /** Actualiza la cantidad de un producto */
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

    /** Elimina un producto del carrito */
    async function handleRemove(orderProductId) {
        setItems(prev => prev.filter(i => i.order_product_id !== orderProductId));
        if (appliedDiscount) setAppliedDiscount(null); // Reset de cupón si el carrito cambia
        await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderProductId }),
        });
        refreshCartCount();
    }

    /** Valida y aplica un cupón de descuento */
    async function handleApplyDiscount() {
        if (!discountCode.trim()) return;
        setDiscountLoading(true);
        setDiscountError('');
        setAppliedDiscount(null);

        try {
            const res = await fetch('/api/cart/validate-discount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode.trim(), subtotal: subtotal }),
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

    /** Procesa y confirma el pedido final */
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
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'Error en pedido',
                    message: data.error || 'No hemos podido procesar tu compra.'
                });
                return;
            }

            setShowModal(false);
            router.push('/dashboard/pedidos');
        } catch {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Fallo Crítico',
                message: 'Error al confirmar el pedido. Por favor, revisa tu conexión.'
            });
        } finally {
            setConfirming(false);
        }
    }

    /** Cambia la dirección de envío seleccionada */
    const handleSelectAddress = (addressId) => {
        setSelectedAddress(addressId);
        setShowAddressList(false);
        setShowNewAddressForm(false);
    };

    /** Crea una nueva dirección de envío */
    async function handleCreateAddress(e) {
        if (e) e.preventDefault();
        
        // Validación manual básica
        const errors = {};
        if (newAddress.calle.length < 5) errors.calle = "Dirección demasiado corta";
        if (newAddress.ciudad.length < 2) errors.ciudad = "Ciudad requerida";
        if (!/^\d{5}$/.test(newAddress.codigo_postal)) errors.codigo_postal = "CP inválido";
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

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
        } catch (err) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error de dirección',
                message: err.message || 'No se ha podido guardar la nueva dirección.'
            });
        } finally {
            setAddressLoading(false);
        }
    }

    /* ── CÁLCULOS DE TOTALES ── */
    const subtotal       = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const discountAmount = appliedDiscount?.discount_amount ?? 0;
    const total          = Math.max(0, subtotal - discountAmount);
    const formatPrice    = (n) => `${parseFloat(n).toFixed(2)}€`;
    const activeAddress  = addresses.find(a => a.address_id === selectedAddress) ?? null;

    if (loading) {
        return <div className={styles.loadingState}>Cargando tu cesta...</div>;
    }

    // 1. VISTA TÁCTIL (Móvil/Tablet)
    if (isTouch) {
        return (
            <main className={`${styles.cartPage} ${styles.touchVersion}`}>
                <AnimatePresence mode="wait">
                    <div className={styles.touchContainer}>
                        
                        {/* ENCABEZADO */}
                        <motion.header 
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.touchHero}
                        >
                            <div className={styles.heroTopRow}>
                                <Link href="/tienda" className={styles.touchBackLink}>
                                    <FaChevronLeft /> VOLVER
                                </Link>
                                {items.length > 0 && (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={styles.touchCountPill}
                                    >
                                        {items.length} {items.length === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}
                                    </motion.div>
                                )}
                            </div>
                            
                            <h1 className={styles.touchMainTitle}>
                                TU <span className={styles.titleAccent}>CESTA</span>
                            </h1>
                        </motion.header>

                        {items.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={styles.emptyCartTouch}
                            >
                                <div className={styles.emptyVisual}>🧶</div>
                                <h2>CESTA VACÍA</h2>
                                <p>Tus alfombras favoritas te están esperando en la tienda.</p>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={styles.touchShopBtn} 
                                    onClick={() => router.push('/tienda')}
                                >
                                    IR A LA TIENDA
                                </motion.button>
                            </motion.div>
                        ) : (
                            <div className={styles.touchJourney}>
                                
                                {/* PRODUCTOS */}
                                <motion.section 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={styles.journeySection}
                                >
                                    <div className={styles.journeyHeader}>
                                        <div className={styles.journeyLine} />
                                        <h2 className={styles.journeyTitle}>01. PRODUCTOS SELECCIONADOS</h2>
                                    </div>
                                    <div className={styles.touchGlassCard}>
                                        <CartItemList 
                                            items={items}
                                            onQuantityChange={handleQuantityChange}
                                            onRemove={handleRemove}
                                            formatPrice={formatPrice}
                                        />
                                    </div>
                                </motion.section>

                                {/* ENTREGA */}
                                <motion.section 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={styles.journeySection}
                                >
                                    <div className={styles.journeyHeader}>
                                        <div className={styles.journeyLine} />
                                        <h2 className={styles.journeyTitle}>02. DETALLES DE ENVÍO</h2>
                                    </div>
                                    <div className={styles.touchGlassCard}>
                                        <AddressSection 
                                            addresses={addresses}
                                            activeAddress={activeAddress}
                                            selectedAddress={selectedAddress}
                                            showAddressList={showAddressList}
                                            setShowAddressList={setShowAddressList}
                                            showNewAddressForm={showNewAddressForm}
                                            setShowNewAddressForm={setShowNewAddressForm}
                                            handleSelectAddress={handleSelectAddress}
                                            handleCreateAddress={handleCreateAddress}
                                            newAddress={newAddress}
                                            setNewAddress={setNewAddress}
                                            formErrors={formErrors}
                                            setFormErrors={setFormErrors}
                                            addressLoading={addressLoading}
                                            router={router}
                                        />
                                    </div>
                                </motion.section>

                                {/* EXTRAS */}
                                <motion.section 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={styles.journeySection}
                                >
                                    <div className={styles.journeyHeader}>
                                        <div className={styles.journeyLine} />
                                        <h2 className={styles.journeyTitle}>03. CUPONES Y NOTAS</h2>
                                    </div>
                                    <div className={styles.touchDoubleCard}>
                                        <DiscountSection 
                                            discountCode={discountCode}
                                            setDiscountCode={setDiscountCode}
                                            appliedDiscount={appliedDiscount}
                                            setAppliedDiscount={setAppliedDiscount}
                                            discountError={discountError}
                                            setDiscountError={setDiscountError}
                                            discountLoading={discountLoading}
                                            onApplyDiscount={handleApplyDiscount}
                                            formatPrice={formatPrice}
                                        />
                                        <div className={styles.touchNoteBox}>
                                            <textarea
                                                className={styles.touchNoteInput}
                                                placeholder="Añadir una nota al pedido..."
                                                value={customerNote}
                                                onChange={e => setCustomerNote(e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </motion.section>

                                {/* PASO 4: RESUMEN FINAL (Eliminado por redundancia con el sticky bar) */}

                                <div className={styles.touchBottomSpacer} />
                            </div>
                        )}
                    </div>
                </AnimatePresence>

                {/* BARRA DE ACCIÓN FLOTANTE */}
                {items.length > 0 && (
                    <motion.div 
                        initial={{ y: 150 }}
                        animate={{ y: 0 }}
                        className={styles.stickyBar}
                    >
                        <div className={styles.stickyMain}>
                            <div className={styles.stickyPriceGroup}>
                                <span className={styles.stickyPriceLabel}>TOTAL ESTIMADO</span>
                                <span className={styles.stickyPriceValue}>{formatPrice(total)}</span>
                            </div>
                            <SecondaryButton 
                                text={confirming ? '...' : 'CONFIRMAR PEDIDO'}
                                onClick={() => setShowModal(true)}
                                disabled={!selectedAddress}
                                className={styles.confirmBtn}
                            />
                        </div>
                        <div className={styles.stickyDisclaimer}>
                            *Presupuesto estimado. Los costes de tufting pueden variar.
                        </div>
                        {appliedDiscount && (
                            <div className={styles.stickySavingBanner}>
                                ¡Has ahorrado {formatPrice(discountAmount)}! 🎁
                            </div>
                        )}
                    </motion.div>
                )}

                <CartModal 
                    showModal={showModal}
                    confirming={confirming}
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleConfirm}
                />

                <FeedbackModal 
                    isOpen={notification.isOpen}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={() => setNotification({ ...notification, isOpen: false })}
                />
            </main>
        );
    }

    // 2. VISTA PARA ESCRITORIO / NO TÁCTILES (Se mantiene igual)
    return (
        <main className={styles.cartPage}>
            <div className={styles.cartContainer}>

                {/* Migajas de pan / Volver */}
                <div className={styles.headerTop}>
                    <Link href="/tienda" className={styles.backBtn}>
                        <FaChevronLeft /> Volver
                    </Link>
                </div>

                {/* Título y Badge */}
                <h1 className={styles.pageTitle}>
                    TU <span className={styles.titleAccent}>CESTA</span>
                    {items.length > 0 && (
                        <span className={styles.itemCountBadge}>
                            {items.length} {items.length === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}
                        </span>
                    )}
                </h1>

                {items.length === 0 ? (
                    /* Estado Vacío */
                    <div className={styles.emptyCart}>
                        <p>Tu cesta está vacía</p>
                        <button className={styles.shopBtn} onClick={() => router.push('/tienda')}>
                            VER DISEÑOS
                        </button>
                    </div>
                ) : (
                    /* Layout Grid Principal */
                    <div className={styles.cartGrid}>
                        
                        {/* COLUMNA IZQUIERDA: Productos y Notas */}
                        <div className={styles.leftCol}>
                            <CartItemList 
                                items={items}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                                formatPrice={formatPrice}
                            />

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

                            <DiscountSection 
                                discountCode={discountCode}
                                setDiscountCode={setDiscountCode}
                                appliedDiscount={appliedDiscount}
                                setAppliedDiscount={setAppliedDiscount}
                                discountError={discountError}
                                setDiscountError={setDiscountError}
                                discountLoading={discountLoading}
                                onApplyDiscount={handleApplyDiscount}
                                formatPrice={formatPrice}
                            />
                        </div>

                        {/* COLUMNA DERECHA: Resumen y Direcciones */}
                        <div className={styles.rightCol}>
                            <CartSummary 
                                subtotal={subtotal}
                                discountAmount={discountAmount}
                                total={total}
                                appliedDiscount={appliedDiscount}
                                formatPrice={formatPrice}
                                onConfirmOrder={() => setShowModal(true)}
                                isConfirmDisabled={!selectedAddress || items.length === 0}
                            />

                            <AddressSection 
                                addresses={addresses}
                                activeAddress={activeAddress}
                                selectedAddress={selectedAddress}
                                showAddressList={showAddressList}
                                setShowAddressList={setShowAddressList}
                                showNewAddressForm={showNewAddressForm}
                                setShowNewAddressForm={setShowNewAddressForm}
                                handleSelectAddress={handleSelectAddress}
                                handleCreateAddress={handleCreateAddress}
                                newAddress={newAddress}
                                setNewAddress={setNewAddress}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                                addressLoading={addressLoading}
                                router={router}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE CONFIRMACIÓN FINAL */}
            <CartModal 
                showModal={showModal}
                confirming={confirming}
                onCancel={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />

            <FeedbackModal 
                isOpen={notification.isOpen}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isOpen: false })}
            />
        </main>
    );
}