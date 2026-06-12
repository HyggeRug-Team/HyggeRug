'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './page.module.css';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';
import { FaPlus, FaMagnifyingGlass, FaTrash, FaXmark, FaCoins } from 'react-icons/fa6';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

/* ─── utilidades ─── */
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatValue(type, value) {
  if (type === 'percentage') return `${parseFloat(value)}%`;
  return `${parseFloat(value).toFixed(2).replace('.', ',')}€`;
}

const EMPTY_FORM = {
  code: '', discount_type: 'percentage', discount_value: '',
  min_order_amount: '', max_uses: '', valid_from: '', valid_until: '',
  hygge_points_cost: '',
};

/* ─── componente principal ─── */
export default function DescuentosPage() {
  const [codes, setCodes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const showFeedback = (type, title, message) =>
    setFeedback({ isOpen: true, type, title, message });

  /* ── carga ── */
  async function fetchCodes() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/discount-codes');
      const data = await res.json();
      if (res.ok) setCodes(data.codes);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCodes(); }, []);

  /* ── stats ── */
  const stats = useMemo(() => ({
    total:    codes.length,
    active:   codes.filter(c => c.is_active).length,
    inactive: codes.filter(c => !c.is_active).length,
    totalUses: codes.reduce((acc, c) => acc + (c.uses_count || 0), 0),
  }), [codes]);

  /* ── filtro ── */
  const filtered = useMemo(() => {
    if (!search.trim()) return codes;
    const q = search.toLowerCase();
    return codes.filter(c => c.code.toLowerCase().includes(q));
  }, [codes, search]);

  /* ── crear ── */
  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/discount-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { showFeedback('error', 'Error', data.error); return; }
      showFeedback('success', 'Código creado', `El código "${form.code.toUpperCase()}" se ha creado correctamente.`);
      setModalOpen(false);
      setForm(EMPTY_FORM);
      fetchCodes();
    } finally {
      setSaving(false);
    }
  }

  /* ── toggle activo ── */
  async function handleToggle(code) {
    const newState = !code.is_active;
    setCodes(prev => prev.map(c => c.code_id === code.code_id ? { ...c, is_active: newState } : c));
    const res = await fetch(`/api/admin/discount-codes/${code.code_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: newState }),
    });
    if (!res.ok) {
      setCodes(prev => prev.map(c => c.code_id === code.code_id ? { ...c, is_active: !newState } : c));
      showFeedback('error', 'Error', 'No se pudo actualizar el estado.');
    }
  }

  /* ── eliminar ── */
  async function handleDelete(code) {
    if (!confirm(`¿Eliminar el código "${code.code}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/discount-codes/${code.code_id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { showFeedback('error', 'No se puede eliminar', data.error); return; }
    setCodes(prev => prev.filter(c => c.code_id !== code.code_id));
    showFeedback('success', 'Eliminado', `El código "${code.code}" ha sido eliminado.`);
  }

  return (
    <div className={styles.page}>
      <DashboardHeader title="Códigos de Descuento" subtitle="Gestiona los cupones de la tienda" />

      {/* ── stats ── */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total códigos</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Activos</span>
          <span className={`${styles.statValue} ${styles.accent}`}>{stats.active}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Desactivados</span>
          <span className={`${styles.statValue} ${styles.red}`}>{stats.inactive}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Usos totales</span>
          <span className={`${styles.statValue} ${styles.purple}`}>{stats.totalUses}</span>
        </div>
      </div>

      {/* ── toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaMagnifyingGlass size={13} />
          <input
            placeholder="Buscar código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
          <FaPlus size={12} /> Nuevo código
        </button>
      </div>

      {/* ── tabla ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descuento</th>
              <th>Tipo</th>
              <th>Mín. pedido</th>
              <th>Usos</th>
              <th>Validez</th>
              <th>Puntos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className={styles.noData}>Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className={styles.noData}>No hay códigos{search ? ' con ese nombre' : ''}.</td></tr>
            ) : filtered.map(c => {
              const pct = c.max_uses ? Math.min(100, (c.uses_count / c.max_uses) * 100) : 0;
              return (
                <tr key={c.code_id}>
                  <td><span className={styles.codeTag}>{c.code}</span></td>
                  <td style={{ fontWeight: 700 }}>{formatValue(c.discount_type, c.discount_value)}</td>
                  <td>
                    <span className={`${styles.typeBadge} ${styles[c.discount_type]}`}>
                      {c.discount_type === 'percentage' ? '%' : 'Fijo'}
                    </span>
                  </td>
                  <td>{parseFloat(c.min_order_amount) > 0 ? `${parseFloat(c.min_order_amount).toFixed(0)}€` : '—'}</td>
                  <td>
                    <div className={styles.usesBar}>
                      <span className={styles.usesText}>
                        {c.uses_count}{c.max_uses ? ` / ${c.max_uses}` : ' / ∞'}
                      </span>
                      {c.max_uses && (
                        <div className={styles.progress}>
                          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                    {formatDate(c.valid_from)} → {formatDate(c.valid_until)}
                  </td>
                  <td>
                    {c.hygge_points_cost
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--hover-text)', fontSize: '0.82rem' }}>
                          <FaCoins size={11} /> {c.hygge_points_cost}
                        </span>
                      : <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>
                    }
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${c.is_active ? styles.active : styles.inactive}`}>
                      <span className={styles.dot} />
                      {c.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.toggleBtn} ${c.is_active ? styles.deactivate : styles.activate}`}
                        onClick={() => handleToggle(c)}
                        title={c.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {c.is_active ? <><FiToggleRight size={14} /> Desactivar</> : <><FiToggleLeft size={14} /> Activar</>}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(c)}
                        title={c.uses_count > 0 ? 'Tiene usos — solo puedes desactivarlo' : 'Eliminar'}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── modal crear ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <div className={styles.modalHeader}>
                <span className={styles.modalTitle}>Nuevo código de descuento</span>
                <button className={styles.closeBtn} onClick={() => setModalOpen(false)}><FaXmark /></button>
              </div>

              <form onSubmit={handleCreate}>
                <div className={styles.formGrid}>

                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Código *</label>
                    <input
                      placeholder="Ej: VERANO25"
                      value={form.code}
                      onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                      required
                      maxLength={50}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tipo de descuento *</label>
                    <select
                      value={form.discount_type}
                      onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Cantidad fija (€)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Valor *</label>
                    <input
                      type="number" min="0.01" step="0.01" placeholder={form.discount_type === 'percentage' ? '10' : '5.00'}
                      value={form.discount_value}
                      onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Pedido mínimo (€)</label>
                    <input
                      type="number" min="0" step="0.01" placeholder="0 = sin mínimo"
                      value={form.min_order_amount}
                      onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Máximo de usos</label>
                    <input
                      type="number" min="1" placeholder="Vacío = ilimitado"
                      value={form.max_uses}
                      onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Válido desde</label>
                    <input
                      type="datetime-local"
                      value={form.valid_from}
                      onChange={e => setForm(f => ({ ...f, valid_from: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Válido hasta</label>
                    <input
                      type="datetime-local"
                      value={form.valid_until}
                      onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Coste en Hygge Points</label>
                    <input
                      type="number" min="1" placeholder="Vacío = gratis, sin coste de puntos"
                      value={form.hygge_points_cost}
                      onChange={e => setForm(f => ({ ...f, hygge_points_cost: e.target.value }))}
                    />
                    <span className={styles.hint}>Si se rellena, el usuario necesitará esa cantidad de puntos para canjear el código.</span>
                  </div>

                </div>

                <div className={styles.modalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? 'Creando...' : 'Crear código'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback(f => ({ ...f, isOpen: false }))}
      />
    </div>
  );
}
