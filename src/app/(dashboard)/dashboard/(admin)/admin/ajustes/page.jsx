/**
 * @file page.jsx
 * @description Panel de control para la configuración maestra de la tienda. 
 * 
 * [Nuestro enfoque]
 * Hemos diseñado esta interfaz para que sea lo más directa y funcional posible. 
 * Queremos que la gestión de variables técnicas no sea un lío, por lo que hemos 
 * agrupado todo por categorías lógicas: multimedia, logística, redes y general.
 * 
 * [Por qué lo hemos hecho así]
 * Centralizar los ajustes en una lista de alta densidad nos permite ver el estado 
 * global de la tienda de un solo vistazo, facilitando cambios rápidos sin navegar 
 * por infinitos submenús.
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';
import { upload } from '@vercel/blob/client';

import {
  FaMagnifyingGlass,
  FaXmark,
  FaSpinner,
  FaPlus,
  FaPen,
  FaTrash,
  FaGear,
  FaCloudArrowUp,
  FaTruckFast,
  FaCircleInfo,
  FaFilm,
  FaShareNodes,
  FaInstagram,
  FaTiktok
} from 'react-icons/fa6';

export default function StoreSettingsPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('multimedia');
  
  // Estados para el control de los modales y el formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [formData, setFormData] = useState({ config_key: '', config_value: '', config_description: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // 1. CARGA DE CONFIGURACIONES
  // Obtenemos todos los ajustes desde nuestra API de administración
  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        setConfigs(data.configs || []);
      }
    } catch (err) { console.error('Error:', err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchConfigs(); }, []);

  // 2. LÓGICA DE CATEGORIZACIÓN
  // Clasificamos las claves según su nombre para que la interfaz sea más intuitiva
  const categorizedConfigs = useMemo(() => {
    const groups = { multimedia: [], logistica: [], redes: [], general: [] };
    configs.forEach(c => {
      const key = c.config_key.toLowerCase();
      if (key.startsWith('social_')) {
        groups.redes.push(c);
      } else if (key.match(/video|image|tiktok|banner|logo|url/)) {
        groups.multimedia.push(c);
      } else if (key.match(/envio|shipping|coste|transporte/)) {
        groups.logistica.push(c);
      } else {
        groups.general.push(c);
      }
    });
    return groups;
  }, [configs]);

  // Filtramos por búsqueda y por la pestaña activa
  const displayedConfigs = useMemo(() => {
    const currentList = categorizedConfigs[activeTab] || [];
    if (!search) return currentList;
    return currentList.filter(c => 
      c.config_key.toLowerCase().includes(search.toLowerCase()) ||
      c.config_description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [categorizedConfigs, activeTab, search]);

  const showFeedback = (type, title, message) => setFeedback({ isOpen: true, type, title, message });

  // Helpers para identificar el tipo de contenido multimedia
  const isVideo = (v) => (v || '').toLowerCase().match(/\.(mp4|webm|mov)$/) || (v || '').includes('blob.vercel-storage.com');
  const isImage = (v) => (v || '').toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/);

  // 4. ACCIONES DEL FORMULARIO
  const handleSave = async () => {
    if (!formData.config_key.trim()) return showFeedback('error', 'Faltan datos', 'La clave técnica es obligatoria.');
    setSaving(true);
    try {
      const isUpdating = !!editingConfig;
      const res = await fetch('/api/admin/config', {
        method: isUpdating ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isUpdating ? { id: editingConfig.id, ...formData } : formData)
      });
      if (!res.ok) throw new Error('Error al guardar el ajuste');
      await fetchConfigs();
      setIsModalOpen(false);
      showFeedback('success', 'Ajuste Sincronizado', 'Los cambios se han guardado en el sistema correctamente.');
    } catch (err) { showFeedback('error', 'Fallo en el Sistema', err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres borrar este ajuste técnico?')) return;
    try {
      const res = await fetch(`/api/admin/config?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo borrar');
      setConfigs(prev => prev.filter(c => c.id !== id));
      showFeedback('success', 'Ajuste Eliminado', 'La clave ha sido borrada permanentemente.');
    } catch (err) { showFeedback('error', 'Error Crítico', err.message); }
  };

  // Gestión de subidas directas a Vercel Blob para archivos pesados
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const newBlob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/admin/upload/client' });
      setFormData(prev => ({ ...prev, config_value: newBlob.url }));
      showFeedback('success', 'Carga Completada', 'El archivo multimedia ya está en la nube.');
    } catch (error) {
      showFeedback('error', 'Error de Carga', error.message);
    } finally { setUploading(false); }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <FaSpinner className={styles.spinIcon} />
      <p style={{fontFamily: 'var(--font-titles)', fontSize: '1.5rem'}}>Cargando Hygge System...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <DashboardHeader 
        isAdmin={true} 
        title="Configuración Maestra"
        description="Ajustes técnicos de multimedia, envíos y sistema global."
      />

      {/* TOOLBAR Y NAVEGACIÓN */}
      <div className={styles.headerActions}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'multimedia' ? styles.activeTab : ''}`} onClick={() => setActiveTab('multimedia')}>
            <FaFilm /> Multimedia
          </button>
          <button className={`${styles.tab} ${activeTab === 'redes' ? styles.activeTab : ''}`} onClick={() => setActiveTab('redes')}>
            <FaShareNodes /> Redes Sociales
          </button>
          <button className={`${styles.tab} ${activeTab === 'logistica' ? styles.activeTab : ''}`} onClick={() => setActiveTab('logistica')}>
            <FaTruckFast /> Logística
          </button>
          <button className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`} onClick={() => setActiveTab('general')}>
            <FaGear /> General
          </button>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <FaMagnifyingGlass className={styles.searchIcon} />
            <input type="text" placeholder="Buscar clave técnica..." className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className={styles.addBtn} onClick={() => {
            setEditingConfig(null);
            setFormData({ config_key: '', config_value: '', config_description: '' });
            setIsModalOpen(true);
          }}>
            <FaPlus /> Nuevo Ajuste
          </button>
        </div>
      </div>

      {/* LISTADO DE CONFIGURACIONES */}
      <div className={styles.configList}>
        <AnimatePresence mode="popLayout">
          {displayedConfigs.map(config => (
            <motion.div 
              key={config.id} 
              className={styles.configRow}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className={styles.miniPreview}>
                {isVideo(config.config_value) ? (
                  <video src={config.config_value} className={styles.miniVid} muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                ) : isImage(config.config_value) ? (
                  <img src={config.config_value} alt="icon" className={styles.miniImg} />
                ) : config.config_key.includes('instagram') ? (
                  <FaInstagram style={{color: '#E1306C'}} />
                ) : config.config_key.includes('tiktok') ? (
                  <FaTiktok />
                ) : (
                  <FaGear className={styles.placeholderIcon} />
                )}
              </div>

              <div className={styles.infoCol}>
                <h3 className={styles.keyLabel}>{config.config_key}</h3>
                <p className={styles.description}>{config.config_description || 'Ajuste del sistema sin descripción.'}</p>
              </div>

              <div className={styles.valueCol}>
                <p className={styles.valueText} title={config.config_value}>{config.config_value || '—'}</p>
              </div>

              <div className={styles.actionsCol}>
                <button className={`${styles.iconBtn}`} onClick={() => {
                  setEditingConfig(config);
                  setFormData({ config_key: config.config_key, config_value: config.config_value, config_description: config.config_description });
                  setIsModalOpen(true);
                }}><FaPen /></button>
                <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(config.id)}><FaTrash /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {displayedConfigs.length === 0 && (
        <div className={styles.emptyState}>
          <FaCircleInfo style={{ fontSize: '2rem', opacity: 0.2 }} />
          <p style={{fontFamily: 'var(--font-titles)'}}>No hay ajustes registrados aquí.</p>
        </div>
      )}

      {/* FORMULARIO DE EDICIÓN / CREACIÓN */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{editingConfig ? 'Editar' : 'Nuevo'} Ajuste</h2>
                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><FaXmark /></button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label>Identificador Técnico (Key)</label>
                  <input 
                    type="text" 
                    value={formData.config_key} 
                    onChange={e => setFormData({...formData, config_key: e.target.value})} 
                    disabled={!!editingConfig}
                    placeholder="Ej: tiktok_video_url"
                  />
                </div>
                <div className={styles.field}>
                  <label>Valor o Recurso Multimedia</label>
                  <div className={styles.inputWrapper}>
                    <input 
                      type="text" 
                      value={formData.config_value} 
                      onChange={e => setFormData({...formData, config_value: e.target.value})} 
                      placeholder="Pega un valor o usa el botón de subida -->"
                    />
                    <label className={styles.uploadBtn} title="Subir archivo a Vercel Blob">
                      <input type="file" hidden onChange={handleFileUpload} accept="video/*,image/*" disabled={uploading} />
                      {uploading ? <FaSpinner className={styles.spinIcon} style={{fontSize: '1rem'}} /> : <FaCloudArrowUp />}
                    </label>
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Descripción Operativa</label>
                  <textarea 
                    rows={2} 
                    value={formData.config_description} 
                    onChange={e => setFormData({...formData, config_description: e.target.value})} 
                    placeholder="Explica para qué sirve este ajuste..."
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving || uploading}>
                  {saving ? 'Guardando...' : 'Confirmar Cambios'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal isOpen={feedback.isOpen} type={feedback.type} title={feedback.title} message={feedback.message} onClose={() => setFeedback({ ...feedback, isOpen: false })} />
    </div>
  );
}
