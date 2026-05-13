/**
 * @file ReturnRequestModal.jsx
 * @description Modal interactivo para solicitar devoluciones usando el componente Modal reutilizable.
 */

'use client';

import React, { useState } from 'react';
import { FaArrowRotateLeft, FaCircleCheck, FaTriangleExclamation } from "react-icons/fa6";
import Modal from "@/components/ui/Modal/Modal";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import { requestReturnAction } from "@/lib/actions";
import styles from './ReviewModal.module.css';

export default function ReturnRequestModal({ orderId, onClose }) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
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

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Solicitar Devolución"
    >
      {!isSuccess ? (
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <FaArrowRotateLeft />
            </div>
            <p className={styles.orderSubtitle}>Pedido #<strong>{orderId}</strong></p>
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
        </div>
      ) : (
        <div className={styles.success}>
          <FaCircleCheck className={styles.successIcon} />
          <h3>¡Solicitud Enviada!</h3>
          <p>Tu solicitud ha sido registrada correctamente. Te redirigimos al historial...</p>
        </div>
      )}
    </Modal>
  );
}
