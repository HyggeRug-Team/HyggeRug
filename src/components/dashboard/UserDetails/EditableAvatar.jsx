/**
 * @file EditableAvatar.jsx
 * @description Componente de cliente para la gestión interactiva de la foto de perfil.
 * 
 * [Nuestro enfoque]
 * Separamos la lógica de la imagen en un componente cliente para manejar la interactividad 
 * del explorador de archivos y las vistas previas sin sobrecargar el Server Component padre.
 * 
 * [Por qué lo hemos hecho así]
 * Implementamos dos vías de actualización: carga directa de archivos locales (PC) y 
 * enlace por URL. Esto da libertad total al usuario para personalizar su identidad 
 * visual de la forma más cómoda posible.
 */
'use client';

import React, { useState, useRef } from 'react';
import styles from './UserDetails.module.css';
import { FaUserPen, FaCloudArrowUp } from "react-icons/fa6";
import TertiaryButton from '@/components/ui/Buttons/TertiaryButton/TertiaryButton';
import { uploadProfileImage } from '@/lib/actions';

/**
 * @file EditableAvatar.jsx
 * @description Componente cliente para gestionar la visualización y edición de la foto de perfil.
 */
export default function EditableAvatar({ currentImage, onSave }) {
    const [showModal, setShowModal] = useState(false);
    const [tempUrl, setTempUrl] = useState(currentImage || "");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleConfirm = () => {
        onSave(tempUrl);
        setShowModal(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadProfileImage(formData);
        
        if (result.success) {
            // Actualizamos la vista previa localmente
            setTempUrl(result.url);
            setShowModal(false);
        } else {
            alert("Error al subir la imagen: " + result.error);
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
        </>
    );
}
