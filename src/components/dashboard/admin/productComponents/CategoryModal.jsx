'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaXmark, FaCircleNotch } from 'react-icons/fa6';
import styles from '../AdminProductsClient/AdminProductsClient.module.css';

export default function CategoryModal({ onClose, onSaved }) {
  const [name, setName]       = useState('');
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre no puede estar vacío'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al crear la categoría'); return; }
      onSaved({ category_id: data.category_id, name: data.name });
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        style={{ maxWidth: 420 }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Nueva categoría</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
            <FaXmark />
          </button>
        </div>

        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <div className={styles.infoForm}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="cat-name">
                <FaTag style={{ marginRight: 5 }} />Nombre de la categoría
              </label>
              <input
                id="cat-name"
                className={styles.input}
                placeholder="Ej: Abstracto, Geométrico…"
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                autoFocus
                disabled={saving}
              />
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.saveBtn} disabled={saving || !name.trim()}>
              {saving
                ? <><FaCircleNotch className={styles.spin} /> Guardando…</>
                : 'Crear categoría'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
