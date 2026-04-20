/**
 * @file EditableInfoModal.jsx
 * @description Campo interactivo que permite al usuario modificar sus datos mediante una ventana modal localizada.
 * 
 * [Nuestro enfoque]
 * El componente actúa como un disparador visual (similar a un input de Login) que abre 
 * una interfaz de edición sobre el propio formulario.
 * 
 * [Por qué lo hemos hecho así]
 * Al usar `useEffect` para sincronizar el valor con el servidor y centrar el modal 
 * de forma absoluta sobre el componente padre, logramos una interfaz que se siente 
 * robusta y rápida, sin saltos bruscos de scroll o cambios de contexto.
 */
'use client';
import { useState, useEffect } from 'react';
import styles from './EditableInfoModal.module.css';
import { MdOutlineModeEditOutline } from "react-icons/md";
import TertiaryButton from '../../Buttons/TertiaryButton/TertiaryButton';

export default function EditableField({ label, value, inputType = "text", onSave }) {
    // Estado para controlar la visibilidad de la ventana modal
    const [showModal, setShowModal] = useState(false);

    // Guardamos el valor temporalmente mientras el usuario escribe
    // Fallback a "" para evitar errores de controlado/no-controlado
    const [name, setName] = useState(value || "");

    // Sincronizamos con el padre si el valor cambia (importante tras revalidar)
    useEffect(() => {
        setName(value || "");
    }, [value]);

    // Avisamos de que queremos guardar y cerramos el modal
    const handleSave = () => {
        if (onSave) {
            onSave(name);
        }
        setShowModal(false);
    };

    return (
        <div className={styles.row}>
            {/* Vista normal con botón de edición */}
            <div className={styles.info} >
                <span className={styles.label}>{label}</span>
                <div className={styles.editBtn} onClick={() => setShowModal(true)}>
                    <p className={styles.displayValue}>{name}</p>
                    <MdOutlineModeEditOutline />
                </div>
            </div>

            {/* Ventana Modal (Solo se renderiza si es necesario) */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    {/* Fondo oscuro traslúcido para centrar la atención */}
                    <div className={styles.backdrop} onClick={() => setShowModal(false)} />

                    <div className={styles.modalContent}>
                        <h3>Modificar {label}</h3>

                        <input
                            type={inputType}
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />

                        <div className={styles.actions}>
                            <TertiaryButton
                                text={"Cancelar"}
                                onClick={() => setShowModal(false)}
                            />

                            <TertiaryButton
                                text={"Actualizar"}
                                onClick={handleSave}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
