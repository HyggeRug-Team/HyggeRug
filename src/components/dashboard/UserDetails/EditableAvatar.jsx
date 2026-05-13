/**
 * @file EditableAvatar.jsx
 * @description Gestión interactiva de la identidad visual del usuario (Avatar).
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este componente para que cambiar la foto de perfil no sea un trámite, 
 * sino una experiencia gratificante. Usamos pre-visualizaciones instantáneas 
 * y validaciones de tamaño en el cliente para que el usuario no pierda tiempo.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Optimización: Validamos que la imagen no pese más de 2MB antes de subirla 
 *    para ahorrar ancho de banda y mantener la base de datos ligera.
 * 2. Mejor respuesta visual: Sustituimos los alerts genéricos por nuestro nuevo 
 *    FeedbackModal, manteniendo la estética cuidada en cada mensaje.
 * 3. Integración Vercel: La subida se realiza directamente a Blob para 
 *    garantizar la máxima velocidad de carga en toda la plataforma.
 */
'use client';

import React, { useState, useRef } from 'react';
import styles from './UserDetails.module.css';
import { FaUserPen, FaCloudArrowUp } from "react-icons/fa6";
import TertiaryButton from '@/components/ui/Buttons/TertiaryButton/TertiaryButton';
import { uploadProfileImage } from '@/lib/actions';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';

export default function EditableAvatar({ currentImage, onSave }) {
    const [showModal, setShowModal] = useState(false);
    const [tempUrl, setTempUrl] = useState(currentImage || "");
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const fileInputRef = useRef(null);

    const handleConfirm = () => {
        onSave(tempUrl);
        setShowModal(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // --- Catch de tamaño en cliente (2MB) ---
        // Comprobamos el tamaño antes de gastar ancho de banda subiendo el archivo.
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Imagen muy pesada',
                message: 'Para mantener la web rápida, el límite de peso es de 2MB. Por favor, reduce su tamaño.'
            });
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadProfileImage(formData);
        
        if (result.success) {
            // Actualizamos la vista previa localmente
            setTempUrl(result.url);
            setShowModal(false);
        } else {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error de subida',
                message: result.error || 'No hemos podido guardar la imagen. Revisa tu conexión.'
            });
        }
        setIsUploading(false);
    };

    return (
        <>
            <div className={styles.imageWrapper}>
                <img
                    src={currentImage || "/profile-default.png"}
                    className={styles.profileImage}
                    alt="Tu identidad"
                />
                <button 
                    className={styles.imageEditBtn} 
                    title="Cambiar foto"
                    onClick={() => setShowModal(true)}
                >
                    <FaUserPen />
                </button>
            </div>

            {showModal && (
                <div className={styles.avatarModalOverlay}>
                    <div className={styles.avatarModalBackdrop} onClick={() => setShowModal(false)} />
                    <div className={styles.avatarModalContent}>
                        <h3>Cambiar foto de perfil</h3>
                        
                        {/* Opción 1: Subir desde PC */}
                        <div className={styles.uploadOption}>
                            <p>Sube una imagen desde tu equipo:</p>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className={styles.uploadTrigger} onClick={() => fileInputRef.current.click()}>
                                <FaCloudArrowUp />
                                <span>{isUploading ? "Subiendo..." : "Seleccionar archivo"}</span>
                            </div>
                        </div>

                        <div className={styles.divider}><span>O</span></div>

                        {/* Opción 2: URL externa */}
                        <div className={styles.uploadOption}>
                            <p>O pega una URL externa:</p>
                            <input 
                                type="text" 
                                className={styles.avatarInput}
                                value={tempUrl}
                                onChange={(e) => setTempUrl(e.target.value)}
                                placeholder="https://ejemplo.com/foto.jpg"
                            />
                        </div>

                        <div className={styles.avatarActions}>
                            <TertiaryButton text="Cancelar" onClick={() => setShowModal(false)} />
                            <TertiaryButton text="Guardar URL" onClick={handleConfirm} />
                        </div>
                    </div>
                </div>
            )}

            <FeedbackModal 
                isOpen={notification.isOpen}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isOpen: false })}
            />
        </>
    );
}
