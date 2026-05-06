/**
 * @file ReturnRequestModal.jsx
 * @description Modal interactivo para que el usuario gestione sus devoluciones.
 * 
 * [Nuestro enfoque]
 * Las devoluciones son momentos delicados. Hemos diseñado este modal para que sea 
 * lo más claro y directo posible, guiando al usuario sin añadir frustración extra. 
 * Usamos animaciones suaves con Framer Motion para que la interfaz se sienta "viva" 
 * y no como un simple formulario estático.
 * 
 * [Por qué lo hemos hecho así]
 * Usamos un Portal de React para inyectar el modal directamente en el body. Esto 
 * evita problemas de z-index o overflow que podrían ocurrir si lo dejáramos dentro 
 * de la jerarquía profunda del Dashboard.
 */

'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ReturnModal.module.css';
import { FaArrowRotateLeft, FaCircleCheck, FaTriangleExclamation, FaXmark } from "react-icons/fa6";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import { requestReturnAction } from "@/lib/actions";

export default function ReturnRequestModal({ orderId, onClose }) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Procesamos el envío de la solicitud
  const handleSubmit = async () => {
    // Validamos que el usuario nos cuente algo coherente (mínimo 10 caracteres)
    if (!reason.trim() || reason.length < 10) {
      setError("Por favor, explica el motivo con al menos 10 caracteres.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await requestReturnAction({ orderId, reason });
    
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = '/dashboard/devoluciones';
      }, 2000);
    } else {
      setError(result.error || "Hubo un error al procesar tu solicitud.");
    }
    setIsSubmitting(false);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles.overlay}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={styles.modal}
      >
        <button className={styles.closeBtn} onClick={onClose}><FaXmark /></button>
        
        {!isSuccess ? (
          <>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <FaArrowRotateLeft />
              </div>
              <h2>Solicitar Devolución</h2>
              <p>Pedido #<strong>{orderId}</strong></p>
            </div>

            <div className={styles.body}>
              <div className={styles.warningBox}>
                <FaTriangleExclamation />
                <p>Recuerda que solo se aceptan devoluciones por defectos técnicos o daños en el transporte dentro de los 14 días naturales.</p>
              </div>

              <label className={styles.label}>Motivo de la devolución</label>
              <textarea 
                className={styles.textarea}
                placeholder="Explica detalladamente qué ha ocurrido con tu alfombra..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
              />
              {error && <p className={styles.errorMsg}>{error}</p>}
            </div>

            <div className={styles.footer}>
              <PrimaryButton 
                text={isSubmitting ? "ENVIANDO..." : "ENVIAR SOLICITUD"} 
                onClick={handleSubmit}
                disabled={isSubmitting}
              />
            </div>
          </>
        ) : (
          <div className={styles.success}>
            <FaCircleCheck className={styles.successIcon} />
            <h3>¡Solicitud Enviada!</h3>
            <p>Tu solicitud ha sido registrada correctamente. Te redirigimos al historial...</p>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
