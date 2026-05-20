/**
 * @file SizesManager.jsx
 * @description Gestor de tallas y precios de un producto desde el panel de administración.
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { FaPlus, FaPen, FaCheck, FaXmark, FaSpinner, FaToggleOn, FaToggleOff } from 'react-icons/fa6';
import styles from '../AdminProductsClient/AdminProductsClient.module.css';

function formatPrice(v) {
  return parseFloat(v || 0).toFixed(2).replace('.', ',') + ' €';
}

export default function SizesManager({ productId }) {
  const [sizes, setSizes]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [editingSize, setEditingSize]   = useState(null);
  const [newSizeName, setNewSizeName]   = useState('');
  const [newSizePrice, setNewSizePrice] = useState('');

  const loadSizes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setSizes(data.product.sizes);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { loadSizes(); }, [loadSizes]);

  const handleAdd = async () => {
    if (!newSizeName.trim() || !newSizePrice) return;
    const res = await fetch(`/api/admin/products/${productId}/sizes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ size: newSizeName.trim(), price: parseFloat(newSizePrice) }),
    });
    if (res.ok) { setNewSizeName(''); setNewSizePrice(''); loadSizes(); }
  };

  const handleToggle = async (sizeId) => {
    await fetch(`/api/admin/products/sizes/${sizeId}`, { method: 'PATCH' });
    loadSizes();
  };

  const handleSaveEdit = async () => {
    if (!editingSize) return;
    const res = await fetch(`/api/admin/products/sizes/${editingSize.size_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ size: editingSize.size_label, price: parseFloat(editingSize.price) }),
    });
    if (res.ok) { setEditingSize(null); loadSizes(); }
  };

  if (loading) {
    return (
      <div className={styles.sizesLoading}>
        <FaSpinner className={styles.spin} /> Cargando tamaños…
      </div>
    );
  }

  return (
    <div className={styles.sizesSection}>
      <div className={styles.sizesList}>
        {sizes.length === 0 && (
          <p className={styles.noSizes}>No hay tamaños definidos aún.</p>
        )}
        {sizes.map(s => (
          <div
            key={s.size_id}
            className={`${styles.sizeRow} ${!s.active ? styles.sizeRowInactive : ''}`}
          >
            {editingSize?.size_id === s.size_id ? (
              <>
                <input
                  className={`${styles.input} ${styles.sizeInput}`}
                  value={editingSize.size_label}
                  onChange={e => setEditingSize({ ...editingSize, size_label: e.target.value })}
                  placeholder="Nombre del tamaño"
                />
                <input
                  className={`${styles.input} ${styles.sizePriceInput}`}
                  type="number"
                  step="0.01"
                  value={editingSize.price}
                  onChange={e => setEditingSize({ ...editingSize, price: e.target.value })}
                />
                <button className={styles.iconBtnSave} onClick={handleSaveEdit} title="Guardar">
                  <FaCheck />
                </button>
                <button className={styles.iconBtnCancel} onClick={() => setEditingSize(null)} title="Cancelar">
                  <FaXmark />
                </button>
              </>
            ) : (
              <>
                <span className={styles.sizeName}>{s.size_label || '—'}</span>
                <span className={styles.sizePrice}>{formatPrice(s.price)}</span>
                <button
                  className={styles.iconBtnEdit}
                  onClick={() => setEditingSize({ size_id: s.size_id, size_label: s.size_label, price: s.price })}
                  title="Editar"
                >
                  <FaPen />
                </button>
                <button
                  className={`${styles.iconBtnToggle} ${s.active ? styles.toggleActive : styles.toggleInactive}`}
                  onClick={() => handleToggle(s.size_id)}
                  title={s.active ? 'Desactivar' : 'Activar'}
                >
                  {s.active ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.addSizeForm}>
        <p className={styles.addSizeTitle}><FaPlus /> Añadir nuevo tamaño</p>
        <div className={styles.addSizeRow}>
          <input
            className={`${styles.input} ${styles.sizeInput}`}
            placeholder="Nombre (ej: 60x90 cm)"
            value={newSizeName}
            onChange={e => setNewSizeName(e.target.value)}
          />
          <input
            className={`${styles.input} ${styles.sizePriceInput}`}
            type="number"
            step="0.01"
            min="0"
            placeholder="Precio"
            value={newSizePrice}
            onChange={e => setNewSizePrice(e.target.value)}
          />
          <button
            className={styles.addSizeBtn}
            onClick={handleAdd}
            disabled={!newSizeName.trim() || !newSizePrice}
          >
            <FaPlus /> Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
