/**
 * @file ContactView.jsx
 * @description Vista interactiva de contacto con formulario premium.
 *
 * [Nuestro enfoque]
 * Encapsulamos el formulario y la interactividad en este componente cliente. 
 * Reutilizamos los componentes de entrada del sistema de diseño (FloatingLabelInput).
 *
 * [Por qué lo hemos hecho así]
 * Para separar los estados del formulario y las animaciones de la definición de metadatos SEO 
 * que residirá en la página principal.
 */

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/app/(main)/contacto/Contacto.module.css';
import FloatingLabelInput from '@/components/ui/Inputs/FloatingLabelInput/FloatingLabelInput';
import SubmitButton from '@/components/ui/Buttons/SubmitButton/SubmitButton';
import CustomSelect from '@/components/ui/Inputs/CustomSelect/CustomSelect';
import { FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram, FaTiktok, FaChevronRight } from 'react-icons/fa';

export default function ContactView() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const subjectOptions = [
        { value: 'pedido', label: 'Estado de mi pedido' },
        { value: 'personalizado', label: 'Pedido 100% Personalizado' },
        { value: 'collab', label: 'Colaboraciones' },
        { value: 'otros', label: 'Otras paranoias' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            alert('¡Mensaje enviado al taller!');
            setIsLoading(false);
        }, 1500);
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
                                    <p>hyggerug@gmail.com</p>
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
                                    <p>L-V: 09:00 - 18:00</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* PARTE DERECHA: FORMULARIO PREMIUM */}
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
                            <a href="https://instagram.com/hygge_rug" target="_blank" className={styles.socialBtn}>
                                SEGUIR <FaChevronRight />
                            </a>
                        </div>
                        <div className={styles.socialCard}>
                            <div className={styles.socialInfo}>
                                <FaTiktok />
                                <span>TIKTOK</span>
                            </div>
                            <a href="https://tiktok.com/@hygge_rug" target="_blank" className={styles.socialBtn}>
                                SEGUIR <FaChevronRight />
                            </a>
                        </div>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
