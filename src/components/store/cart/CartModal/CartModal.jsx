/**
 * @file CartModal.jsx
 * @description Modal de confirmación final antes de procesar el pedido.
 * 
 * [Nuestro enfoque]
 * Utilizamos un overlay con desenfoque (backdrop-filter) para focalizar la atención del usuario
 * en el paso final, evitando distracciones con el resto de la interfaz.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Seguridad: Pedimos confirmación explícita para evitar compras accidentales.
 * 2. Transparencia: Reiteramos el aviso de "Presupuesto Estimado" para que el cliente sea
 *    consciente de la naturaleza artesanal del producto justo antes del pago.
 * 3. Feedback: Mostramos estados de carga claros (confirming) para evitar el "doble clic" y
 *    mantener al usuario informado del proceso.
 */

import React from 'react';
import { FaPalette, FaTriangleExclamation } from 'react-icons/fa6';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import styles from './CartModal.module.css';

/**
 * @param {Object} props
 * @param {boolean} props.showModal - Controla la visibilidad.
 * @param {boolean} props.confirming - Estado de carga al confirmar.
 * @param {Function} props.onCancel - Acción al cancelar.
 * @param {Function} props.onConfirm - Acción al confirmar pedido final.
 */
export default function CartModal({ showModal, confirming, onCancel, onConfirm }) {
    if (!showModal) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                
                {/* Icono decorativo */}
                <div className={styles.modalIcon}>
                    <FaPalette />
                </div>

                <h2 className={styles.modalTitle}>¿Confirmar pedido?</h2>
                
                <p className={styles.modalDesc}>
                    Estás a punto de formalizar tu pedido. Recuerda que este es un <strong>presupuesto estimado</strong>; los costes de materiales de tufting pueden variar y el precio final se ajustará en el siguiente paso del proceso.
                </p>

                <div className={styles.modalActions}>
                    <SecondaryButton 
                        text="REVISAR CESTA"
                        onClick={onCancel}
                        disabled={confirming}
                        className={styles.modalBtn}
                    />
                    
                    <SecondaryButton 
                        text={confirming ? 'PROCESANDO...' : 'SÍ, CONFIRMAR'}
                        onClick={onConfirm}
                        disabled={confirming}
                        className={styles.modalBtn}
                    />
                </div>

                {confirming && (
                    <p style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--grey-600)' }}>
                        <FaTriangleExclamation /> No cierres esta ventana mientras procesamos tu pedido...
                    </p>
                )}
            </div>
        </div>
    );
}
