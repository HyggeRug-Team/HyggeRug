/**
 * @file DiscountSection.jsx
 * @description Componente para aplicar cupones de descuento al carrito.
 */

import React from 'react';
import { FaTag, FaCircleCheck } from 'react-icons/fa6';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import styles from './DiscountSection.module.css';

/**
 * @param {Object} props
 * @param {string} props.discountCode - Valor del input de descuento.
 * @param {Function} props.setDiscountCode - Setter del input.
 * @param {Object} props.appliedDiscount - Datos del cupón si ha sido validado.
 * @param {Function} props.setAppliedDiscount - Setter del cupón validado.
 * @param {string} props.discountError - Mensaje de error si falla.
 * @param {Function} props.setDiscountError - Setter del error.
 * @param {boolean} props.discountLoading - Estado de carga de la validación.
 * @param {Function} props.onApplyDiscount - Manejador para validar el código.
 * @param {Function} props.formatPrice - Utilidad para formatear precios.
 */
export default function DiscountSection({ 
    discountCode, 
    setDiscountCode, 
    appliedDiscount, 
    setAppliedDiscount,
    discountError,
    setDiscountError,
    discountLoading,
    onApplyDiscount,
    formatPrice
}) {
    return (
        <section className={styles.card}>
            <div className={styles.cardTitle}>
                <FaTag /> CÓDIGO DE DESCUENTO
            </div>
            
            {!appliedDiscount ? (
                /* Estado: Para aplicar código */
                <div className={styles.discountRow}>
                    <input
                        type="text"
                        placeholder="Introduce tu código..."
                        className={styles.discountInput}
                        value={discountCode}
                        onChange={e => {
                            setDiscountCode(e.target.value.toUpperCase());
                            if (discountError) setDiscountError('');
                        }}
                    />
                    <PrimaryButton 
                        text={discountLoading ? "..." : "APLICAR"}
                        onClick={onApplyDiscount}
                        disabled={discountLoading || !discountCode.trim()}
                        className={styles.discountActionBtn}
                    />
                </div>
            ) : (
                /* Estado: Código aplicado con éxito */
                <div className={styles.discountSuccess}>
                    <FaCircleCheck />
                    <span>
                        Cupón <strong>{appliedDiscount.code}</strong> aplicado: -{formatPrice(appliedDiscount.discount_amount)}
                    </span>
                    <button 
                        className={styles.linkBtn} 
                        style={{ marginLeft: 'auto', fontSize: '0.7rem' }}
                        onClick={() => {
                            setAppliedDiscount(null);
                            setDiscountCode('');
                        }}
                    >
                        Quitar
                    </button>
                </div>
            )}

            {/* Mensaje de Error */}
            {discountError && (
                <div className={styles.discountError}>
                    {discountError}
                </div>
            )}
        </section>
    );
}
