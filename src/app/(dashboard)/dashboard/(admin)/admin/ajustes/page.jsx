/**
 * @file page.jsx
 * @description Panel de Ajustes de la Tienda para la administración.
 * 
 * [Nuestro enfoque]
 * El panel de ajustes es el "cerebro" de Hygge Rug. Desde aquí controlamos 
 * variables críticas (como costes de envío, avisos globales, etc.) de forma directa.
 * En lugar de una simple base de datos, hemos diseñado una interfaz visual que 
 * permite gestionar estos pares clave-valor sin riesgo a romper nada.
 * 
 * [Por qué lo hemos hecho así]
 * Mantenemos la estructura de tarjetas modulares ("cards") con bordes punteados 
 * característicos. Hemos integrado un modal rápido para crear o editar configuraciones 
 * sobre la marcha, asegurando que los administradores no tengan que salir de la página 
 * principal para hacer un cambio rápido.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

import {
  FaMagnifyingGlass,
  FaXmark,
  FaSpinner,
  FaPlus,
  FaPen,
  FaTrash,
  FaGear
} from 'react-icons/fa6';

export default function StoreSettingsPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Estado para el modal de edición/creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  
  // Formulario del modal
  const [formData, setFormData] = useState({
    config_key: '',
    config_value: '',
    config_description: ''
  });
  const [saving, setSaving] = useState(false);

  // 1. Cargar las configuraciones
  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        setConfigs(data.configs || []);
      }
    } catch (err) {
      console.error('Error cargando ajustes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // 2. Filtrado de configuraciones
  const filteredConfigs = configs.filter(c => 
    c.config_key.toLowerCase().includes(search.toLowerCase()) ||
    c.config_description?.toLowerCase().includes(search.toLowerCase()) ||
    c.config_value?.toLowerCase().includes(search.toLowerCase())
  );

  // 3. Manejo del Modal
  const openModal = (config = null) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        config_key: config.config_key,
        config_value: config.config_value,
        config_description: config.config_description
      });
    } else {
      setEditingConfig(null);
      setFormData({ config_key: '', config_value: '', config_description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConfig(null);
  };

  // 4. Guardar (Crear o Actualizar)
  const handleSave = async () => {
    if (!formData.config_key.trim()) {
      alert("La clave (key) es obligatoria.");
      return;
    }
    setSaving(true);
    
    try {
      const isUpdating = !!editingConfig;
      const url = '/api/admin/config';
      const method = isUpdating ? 'PUT' : 'POST';
      const body = isUpdating 
        ? { id: editingConfig.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      
      await fetchConfigs();
      closeModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 5. Eliminar
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este ajuste? Esta acción no se puede deshacer.')) return;
    
    try {
      const res = await fetch(`/api/admin/config?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      
      // Actualizamos estado local rápido
      setConfigs(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  /* ── RENDERIZADO DEL COMPONENTE ── */
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinIcon} />
        <p>Cargando los ajustes de la tienda...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      
      {/* CABECERA */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Ajustes de Tienda</h1>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <FaPlus /> Nuevo Ajuste
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <FaMagnifyingGlass className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por clave, valor o descripción..."
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>
              <FaXmark />
            </button>
          )}
        </div>
      </div>

      {/* LISTA DE AJUSTES */}
      <div className={styles.configList}>
        {filteredConfigs.length === 0 ? (
          <div className={styles.emptyState}>
            <FaGear style={{ fontSize: '4rem', opacity: 0.2 }} />
            <p>No se encontraron ajustes.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredConfigs.map(config => (
              <motion.div 
                key={config.id} 
                className={styles.configCard}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className={styles.configHeader}>
                  <div className={styles.configKeyWrapper}>
                    <h3 className={styles.configKey}>{config.config_key}</h3>
                    <span className={styles.configIdBadge}>ID: {config.id}</span>
                  </div>
                </div>
                
                {config.config_description && (
                  <p className={styles.configDesc}>{config.config_description}</p>
                )}
                
                <div className={styles.configValueWrapper}>
                  <span className={styles.configValueLabel}>Valor asignado</span>
                  <p className={styles.configValue}>{config.config_value || '—'}</p>
                </div>
                
                <div className={styles.configActions}>
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => openModal(config)}
                    title="Editar ajuste"
                  >
                    <FaPen /> Editar
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                    onClick={() => handleDelete(config.id)}
                    title="Eliminar ajuste"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* MODAL DE EDICIÓN / CREACIÓN */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingConfig ? 'Editar Ajuste' : 'Nuevo Ajuste'}
                </h2>
                <button className={styles.closeBtn} onClick={closeModal}>
                  <FaXmark />
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.inputGroup}>
                  <label>Clave (Key) *</label>
                  <input 
                    type="text" 
                    placeholder="Ej: envio_gratis_minimo"
                    value={formData.config_key}
                    onChange={e => setFormData({...formData, config_key: e.target.value})}
                    disabled={!!editingConfig} // Si editamos, preferimos no cambiar la key para evitar líos
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Valor</label>
                  <input 
                    type="text" 
                    placeholder="Ej: 60"
                    value={formData.config_value}
                    onChange={e => setFormData({...formData, config_value: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Descripción</label>
                  <textarea 
                    placeholder="Explica para qué sirve este ajuste..."
                    rows={3}
                    value={formData.config_description}
                    onChange={e => setFormData({...formData, config_description: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={closeModal}>Cancelar</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Ajuste'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
