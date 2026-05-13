/**
 * @file CustomOrderClient.jsx
 * @description Formulario para solicitar una alfombra personalizada.
 *
 * [Nuestro enfoque]
 * Hemos construido este formulario para que el cliente pueda enviarnos su idea con todos
 * los detalles necesarios: título, descripción, imagen de referencia, medidas y comentarios.
 * Reutilizamos los componentes de entrada del sistema de diseño del proyecto.
 *
 * [Por qué lo hemos hecho así]
 * El pedido se guarda como "pendiente de aprobación" para que el equipo del taller
 * lo revise y proponga un presupuesto antes de comprometerse con la fabricación.
 */
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaMagic, FaRulerCombined, FaCommentDots, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { FaPalette } from 'react-icons/fa6';
import styles from './CustomOrder.module.css';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';
import FloatingLabelInput from '@/components/ui/Inputs/FloatingLabelInput/FloatingLabelInput';
import CustomSelect from '@/components/ui/Inputs/CustomSelect/CustomSelect';

export default function CustomOrderClient({ user }) {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        size: '100x100',
        comments: ''
    });
    const [notification, setNotification] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const fileInputRef = useRef(null);

    const sizeOptions = [
        { value: '60x60', label: 'Pequeña (60x60)' },
        { value: '100x100', label: 'Mediana (100x100)' },
        { value: '150x150', label: 'Grande (150x150)' },
        { value: 'Custom', label: 'A medida (Especificar)' },
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (val) => {
        setFormData(prev => ({ ...prev, size: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Sesión Requerida',
                message: 'Debes iniciar sesión para enviar un diseño personalizado.'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/orders/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    image: imagePreview,
                    userId: user.userId
                })
            });

            const data = await response.json();

            if (data.success) {
                setNotification({
                    isOpen: true,
                    type: 'success',
                    title: '¡Diseño Enviado!',
                    message: 'Hemos recibido vuestro diseño. Nuestro equipo lo revisará y os contactaremos pronto con un presupuesto.'
                });
                setFormData({ title: '', description: '', size: '100x100', comments: '' });
                setImagePreview(null);
            } else {
                throw new Error(data.error || 'Error al enviar el pedido');
            }
        } catch (error) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error en el envío',
                message: error.message || 'No hemos podido procesar vuestro pedido.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.personalizarWrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className={styles.title}>Personalizar</h1>
                        <p className={styles.subtitle}>
                            ¿Tenéis una idea propia? Convertimos vuestros bocetos, fotos o logos en alfombras únicas hechas a mano.
                        </p>
                    </motion.div>
                </header>

                <div className={styles.formGrid}>
                    <motion.div 
                        className={styles.formCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className={styles.authForm}>
                            <div className={styles.inputGroup}>
                                <FloatingLabelInput 
                                    label="Título del diseño"
                                    type="text" 
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Descripción del diseño</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Contadnos un poco sobre qué buscáis con esta alfombra..." 
                                    className={styles.textarea}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Referencia visual</label>
                                <div 
                                    className={styles.uploadArea}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <div style={{ position: 'relative' }}>
                                            <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                                            <button 
                                                type="button" 
                                                className={styles.removeImage}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImagePreview(null);
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <FaCloudUploadAlt className={styles.uploadIcon} />
                                            <p className={styles.uploadText}>Subir imagen</p>
                                        </>
                                    )}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <FloatingLabelInput 
                                    label="Tamaño deseado (ej: 120x80 cm)"
                                    type="text" 
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    required
                                />
                                <p className={styles.inputHint}>Podéis indicar medidas rectangulares o formas especiales.</p>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Comentarios adicionales</label>
                                <textarea 
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleInputChange}
                                    placeholder="Colores específicos, formas, urgencia o cualquier detalle que debamos saber..." 
                                    className={styles.textarea}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar para Aprobación'}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div 
                        className={styles.sidebar}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className={styles.infoBox}>
                            <h3 className={styles.infoTitle}>Nuestro Proceso</h3>
                            <ul className={styles.infoList}>
                                <li className={styles.infoItem}>
                                    <FaCheckCircle />
                                    <span><strong>Revisión:</strong> Analizamos vuestro diseño y viabilidad.</span>
                                </li>
                                <li className={styles.infoItem}>
                                    <FaPalette />
                                    <span><strong>Presupuesto:</strong> Os enviamos el precio final.</span>
                                </li>
                                <li className={styles.infoItem}>
                                    <FaMagic />
                                    <span><strong>Fabricación:</strong> Empezamos con vuestra pieza única.</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            <FeedbackModal 
                isOpen={notification.isOpen}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
