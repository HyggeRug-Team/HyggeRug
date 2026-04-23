"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";
import styles from "./Modal.module.css";

/**
 * Modal genérico reutilizable.
 * Usa createPortal para renderizar directamente en document.body,
 * evitando problemas de z-index con elementos padre que tengan transform u overflow.
 *
 * @param {boolean}  isOpen   - Controla si el modal está visible
 * @param {function} onClose  - Callback para cerrar el modal
 * @param {string}   title    - Título del modal
 * @param {node}     children - Contenido interior del modal
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // Bloquea el scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Cierra el modal al hacer click en el backdrop pero no en el contenido
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  // createPortal renderiza el modal como hijo directo del body,
  // independientemente de dónde esté en el árbol de componentes
  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar modal">
            <FaXmark />
          </button>
        </div>

        <div className={styles.modalBody}>
          {children}
        </div>

      </div>
    </div>,
    document.body // renderiza fuera del árbol, directo al body
  );
}