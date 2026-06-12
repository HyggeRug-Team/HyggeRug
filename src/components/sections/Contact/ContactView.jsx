/**
 * @file ContactView.jsx
 * @description Vista interactiva de contacto con formulario especializado.
 *
 * [Nuestro enfoque]
 * Hemos diseñado este componente de cliente para gestionar toda la lógica interactiva 
 * del formulario. Reutilizamos piezas clave de nuestro sistema de diseño, como 
 * los FloatingLabelInput, para asegurar una experiencia de usuario fluida y coherente.
 *
 * [Por qué lo hemos hecho así]
 * Esta separación nos permite mantener la interactividad pesada en el lado del cliente 
 * mientras la página padre gestiona la metadata SEO, optimizando tanto el rendimiento 
 * como la visibilidad en buscadores.
 */

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/app/(main)/contacto/Contacto.module.css';
import FloatingLabelInput from '@/components/ui/Inputs/FloatingLabelInput/FloatingLabelInput';
import SubmitButton from '@/components/ui/Buttons/SubmitButton/SubmitButton';
import CustomSelect from '@/components/ui/Inputs/CustomSelect/CustomSelect';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';
import { FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram, FaTiktok, FaChevronRight } from 'react-icons/fa';

export default function ContactView({ socialLinks }) {
    const instagramUrl = socialLinks?.social_instagram || "https://instagram.com/hygge_rug";
    const tiktokUrl = socialLinks?.social_tiktok || "https://tiktok.com/@hygge_rug";
    const contactEmail = socialLinks?.contact_email || "contacto@hyggerug.com";

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    const subjectOptions = [
        { value: 'collab', label: 'Colaboraciones' },
        { value: 'personalizado', label: 'Dudas sobre diseños a medida' },
        { value: 'workshop', label: 'Workshops y talleres' },
        { value: 'otros', label: 'Otros temas' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setNotification({
                    isOpen: true,
                    type: 'success',
                    title: '¡Mensaje Enviado!',
                    message: 'Hemos recibido tu consulta. El equipo del taller te responderá muy pronto al correo indicado.'
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error('Error en el envío');
            }
        } catch (error) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error de envío',
                message: 'No hemos podido enviar vuestro mensaje. Por favor, intentadlo de nuevo más tarde.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.contactoWrapper}>
            <div className={styles.container}>
                
                <div className={styles.mainGrid}>
                    
                    {/* PARTE IZQUIERDA: CONTENIDO E INFO */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.contentSide}
                    >
                        <div className={styles.badgeGlow}>DUDAS O ENCARGOS</div>
                        <h1 className={styles.titleLoud}>CONTACTA <br/> CON NOSOTROS</h1>
                        <p className={styles.description}>
                            ¿Tienes una paranoia extrema para una alfombra? ¿Quieres colaborar? O simplemente tienes una duda con tu pedido. Suéltalo todo por el formulario o usa nuestras vías directas.
                        </p>

                        <div className={styles.infoStack}>
                            <div className={styles.infoCard}>
                                <FaEnvelope className={styles.infoIcon} />
                                <div className={styles.infoText}>
                                    <h4>EMAIL DIRECTO</h4>
                                    <p>{contactEmail}</p>
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <FaMapMarkerAlt className={styles.infoIcon} />
                                <div className={styles.infoText}>
                                    <h4>EL TALLER</h4>
                                    <p>MADRID, ESPAÑA</p>
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <FaClock className={styles.infoIcon} />
                                <div className={styles.infoText}>
                                    <h4>ATENCIÓN</h4>
                                    <p>Sin horario fijo, te respondemos lo antes posible</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* PARTE DERECHA: FORMULARIO DEL TALLER */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className={styles.formCard}
                    >
                        <div className={styles.form}>
                            <h2>Escribe al taller</h2>
                            <p>Te responderemos lo antes posible.</p>
                            
                            <form onSubmit={handleSubmit}>
                                <div className={styles.inputGrid}>
                                    <FloatingLabelInput 
                                        label="Tu Nombre"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FloatingLabelInput 
                                        label="Email de contacto"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    
                                    <div className={styles.selectWrapper}>
                                        <label className={styles.selectLabel}>Motivo del mensaje</label>
                                        <CustomSelect 
                                            value={formData.subject}
                                            options={subjectOptions}
                                            onChange={(val) => setFormData({...formData, subject: val})}
                                            placeholder="¿De qué hablamos?"
                                        />
                                    </div>

                                    <FloatingLabelInput 
                                        label="¿Qué nos cuentas?"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        textarea
                                        rows={5}
                                    />
                                </div>

                                <SubmitButton 
                                    isLoading={isLoading} 
                                    isLogin={true} 
                                    textLogin="Enviar Mensaje" 
                                />
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* SECCIÓN SOCIAL INFERIOR */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={styles.socialSection}
                >
                    <div className={styles.socialGrid}>
                        <div className={styles.socialCard}>
                            <div className={styles.socialInfo}>
                                <FaInstagram />
                                <span>INSTAGRAM</span>
                            </div>
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                                SEGUIR <FaChevronRight />
                            </a>
                        </div>
                        <div className={styles.socialCard}>
                            <div className={styles.socialInfo}>
                                <FaTiktok />
                                <span>TIKTOK</span>
                            </div>
                            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                                SEGUIR <FaChevronRight />
                            </a>
                        </div>
                    </div>
                </motion.section>

            </div>

            <FeedbackModal 
                isOpen={notification.isOpen}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isOpen: false })}
            />
        </div>
    );
}
