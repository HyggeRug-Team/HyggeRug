/**
 * @file CartSummary.jsx
 * @description Componente lateral que muestra el desglose de totales,
 * descuentos aplicados y el botón principal de confirmación.
 * 
 * [Nuestro enfoque]
 * Actúa como la "caja registradora" visual del carrito. Centralizamos aquí la visualización de 
 * cálculos para que el usuario siempre tenga claro el precio estimado antes de proceder.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Jerarquía Visual: Utilizamos tipografías de gran tamaño (Tufting Pop) para el total,
 *    asegurando que la información más importante destaque sobre el resto.
 * 2. Adaptabilidad: En móviles, este componente oculta el botón principal y el total para
 *    delegar esa responsabilidad a la barra sticky inferior, evitando redundancias.
 * 3. Confianza: Incluimos badges de seguridad y manufactura para reforzar la propuesta de
 *    valor de la marca en el momento del cierre de venta.
 */

import React from 'react';
import { FaShieldHeart, FaTruckFast, FaPalette } from 'react-icons/fa6';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import styles from './CartSummary.module.css';

/**
 * @param {Object} props
 * @param {number} props.subtotal - Suma de productos sin descuentos.
 * @param {number} props.discountAmount - Cantidad a descontar.
 * @param {number} props.total - Total final.
 * @param {Object} props.appliedDiscount - Datos del cupón activo.
 * @param {Function} props.formatPrice - Utilidad de formateo.
 * @param {Function} props.onConfirmOrder - Acción al confirmar pedido.
 * @param {boolean} props.isConfirmDisabled - Bloqueo del botón de confirmación.
 */
export default function CartSummary({ 
    subtotal, 
    discountAmount, 
    total, 
    appliedDiscount, 
    formatPrice, 
    onConfirmOrder,
    isConfirmDisabled
}) {
    return (
        <section className={styles.card}>
            <div className={styles.cardTitle}>RESUMEN DEL PEDIDO</div>
            
            <div className={styles.summaryRows}>
                {/* Subtotal */}
                <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>

                {/* Envío (Informativo) */}
                <div className={styles.summaryRow}>
                    <span>Envío</span>
                    <span className={styles.pendingLabel}>Calculado en el checkout</span>
                </div>

                {/* Descuento si existe */}
                {appliedDiscount && (
                    <div className={`${styles.summaryRow} ${styles.discountRow2}`}>
                        <span>Descuento ({appliedDiscount.code})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                    </div>
                )}

                {/* Total Final (Oculto en móvil si hay barra sticky) */}
                <div className={`${styles.totalRow} ${styles.hideOnMobile}`}>
                    <span>TOTAL ESTIMADO</span>
                    <span className={styles.totalAmount}>{formatPrice(total)}</span>
                </div>

                <p className={styles.totalNote}>
                    *Este es un <strong>presupuesto estimado</strong>. Debido a la naturaleza artesanal del tufting, los costes finales de materiales y manufactura pueden variar ligeramente. El precio definitivo se confirmará en el siguiente proceso.
                </p>
            </div>

            {/* Botón de Acción Principal (Desktop) */}
            <SecondaryButton 
                text="CONFIRMAR PEDIDO"
                onClick={onConfirmOrder}
                disabled={isConfirmDisabled}
                className={styles.confirmBtnFull}
            />

            {/* Badges de Confianza */}
            <div className={styles.trustBadges}>
                <div className={styles.trustItem}>
                    <FaShieldHeart />
                    <span>Pago Seguro</span>
                </div>
                <div className={styles.trustItem}>
                    <FaTruckFast />
                    <span>Envío Express</span>
                </div>
                <div className={styles.trustItem}>
                    <FaPalette />
                    <span>Hecho a mano</span>
                </div>
            </div>
        </section>
    );
}
