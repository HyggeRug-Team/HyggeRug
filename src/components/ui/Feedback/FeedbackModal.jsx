/**
 * @file FeedbackModal.jsx
 * @description Ventana emergente para notificaciones de éxito y error.
 *
 * [Nuestro enfoque]
 * Hemos creado este componente para reemplazar los 'alert()' del navegador. Queremos
 * que cada notificación, incluso los errores, se sienta parte de la experiencia del taller.
 *
 * [Por qué lo hemos hecho así]
 * Hemos usado portales para que el modal flote siempre por encima de todo sin problemas
 * de z-index, y Framer Motion para que la entrada y salida sea suave y no interrumpa al usuario.
 */
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircleCheck, FaTriangleExclamation, FaXmark } from "react-icons/fa6";
import { createPortal } from 'react-dom';
import styles from './FeedbackModal.module.css';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton';

export default function FeedbackModal({ isOpen, type = 'success', title, message, onClose }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button className={styles.closeBtn} onClick={onClose}><FaXmark /></button>
            
            <div className={styles.content}>
              <div className={`${styles.icon} ${styles[type]}`}>
                {type === 'success' ? <FaCircleCheck /> : <FaTriangleExclamation />}
              </div>
              
              <h2>{title || (type === 'success' ? '¡Todo ha ido bien!' : 'Algo ha fallado')}</h2>
              <p>{message}</p>
              
              <div className={styles.actions}>
                <PrimaryButton 
                  text="ENTENDIDO" 
                  onClick={onClose} 
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
