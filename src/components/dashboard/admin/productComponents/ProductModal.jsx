'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaXmark, FaCheck, FaSpinner, FaImage, FaEye, FaUsers, FaToggleOn, FaToggleOff,
} from 'react-icons/fa6';
import SizesManager from './SizesManager';
import styles from '../AdminProductsClient/AdminProductsClient.module.css';

export default function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const fileRef = useRef(null);

  const [tab, setTab]               = useState('info');
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState('');

  const [name, setName]             = useState(product?.name         || '');
  const [desc, setDesc]             = useState(product?.description  || '');
  const [imageUrl, setImageUrl]     = useState(product?.image_url    || '');
  const [basePrice, setBasePrice]   = useState(product?.base_price   || '');
  const [categoryId, setCategoryId] = useState(product?.category_id  ? String(product.category_id) : '');
  const [isPublic, setIsPublic]     = useState(!!product?.public);
  const [community, setCommunity]   = useState(!!product?.community);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'products');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim())  { setError('El nombre es obligatorio');    return; }
    if (!basePrice)    { setError('El precio base es obligatorio'); return; }
    setSaving(true);
    setError('');
    try {
      const body = {
        name: name.trim(),
        description: desc.trim() || null,
        image_url: imageUrl || null,
        base_price: parseFloat(basePrice),
        category_id: categoryId ? Number(categoryId) : null,
        isPublic,
        community,
      };
      const res = isEdit
        ? await fetch(`/api/admin/products/${product.product_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Error al guardar');
        return;
      }
      onSaved();
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
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? `Editando: ${product.name}` : 'Nuevo diseño'}
          </h2>
          <button className={styles.modalClose} onClick={onClose}><FaXmark /></button>
        </div>

        {isEdit && (
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'info' ? styles.tabActive : ''}`}
              onClick={() => setTab('info')}
            >
              Información
            </button>
            <button
              className={`${styles.tab} ${tab === 'sizes' ? styles.tabActive : ''}`}
              onClick={() => setTab('sizes')}
            >
              Tamaños
            </button>
          </div>
        )}

        <div className={styles.modalBody}>
          {tab === 'info' && (
            <div className={styles.infoForm}>
              {/* Imagen */}
              <div className={styles.imageSection}>
                <div className={styles.imagePreview}>
                  {imageUrl
                    ? <img src={imageUrl} alt="Preview" />
                    : <div className={styles.imagePlaceholder}><FaImage /></div>
                  }
                </div>
                <div className={styles.imageActions}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <button
                    className={styles.uploadBtn}
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <FaSpinner className={styles.spin} /> : <FaImage />}
                    {uploading ? 'Subiendo…' : 'Cambiar imagen'}
                  </button>
                  <input
                    className={styles.input}
                    placeholder="O pega una URL de imagen"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Campos */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre *</label>
                  <input
                    className={styles.input}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nombre del diseño"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Precio base (€) *</label>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.01"
                    min="0"
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoría</label>
                  <select
                    className={styles.select}
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                  >
                    <option value="">Sin categoría</option>
                    {categories.map(c => (
                      <option key={c.category_id} value={String(c.category_id)}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Descripción del diseño…"
                />
              </div>

              <div className={styles.toggleRow}>
                <ToggleField
                  label="Público"
                  description="Cliente visible"
                  icon={<FaEye />}
                  value={isPublic}
                  onChange={setIsPublic}
                />
                <ToggleField
                  label="Comunidad"
                  description="Aparece en la sección de diseños comunitarios"
                  icon={<FaUsers />}
                  value={community}
                  onChange={setCommunity}
                />
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? <FaSpinner className={styles.spin} /> : <FaCheck />}
                {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear diseño'}
              </button>
            </div>
          )}

          {tab === 'sizes' && isEdit && (
            <SizesManager productId={product.product_id} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ToggleField solo se usa aquí, no merece su propio archivo */
function ToggleField({ label, description, icon, value, onChange }) {
  return (
    <button
      type="button"
      className={`${styles.toggleField} ${value ? styles.toggleFieldOn : ''}`}
      onClick={() => onChange(!value)}
    >
      <span className={styles.toggleFieldIcon}>{icon}</span>
      <div className={styles.toggleFieldText}>
        <span className={styles.toggleFieldLabel}>{label}</span>
        <span className={styles.toggleFieldDesc}>{description}</span>
      </div>
      <span className={styles.toggleFieldSwitch}>
        {value
          ? <FaToggleOn className={styles.switchOn} />
          : <FaToggleOff className={styles.switchOff} />
        }
      </span>
    </button>
  );
}
