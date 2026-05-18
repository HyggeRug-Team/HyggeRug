/**
 * @file ConfirmDeleteModal.jsx
 * @description Modal de confirmación para evitar borrados accidentales de productos del catálogo.
 */
'use client';

import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa6';
import styles from '../AdminProductsClient/AdminProductsClient.module.css';

export default function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className={styles.confirmModal}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <FaTrash className={styles.confirmIcon} />
        <h3 className={styles.confirmTitle}>¿Eliminar este diseño?</h3>
        <p className={styles.confirmText}>
          Esta acción es permanente. Se borrarán también todos sus tamaños
          y se eliminará de cualquier carrito activo.
          Si el producto está en pedidos confirmados, el borrado será rechazado.
        </p>
        <div className={styles.confirmActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>Sí, eliminar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
