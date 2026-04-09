/**
 * @file EditableInfoModal.jsx
 * @description Campo interactivo que permite al usuario modificar sus datos mediante una ventana modal.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este componente para que el usuario pueda cambiar su información (como su apodo) 
 * de forma intuitiva sin salir de la página actual.
 * 
 * [Por qué lo hemos hecho así]
 * Usamos un modal para que el usuario edite en el mismo contexto, evitando perder tiempo y
 * reduciendo la sensación de “estar cambiando de sitio” mientras modifica su perfil.
 *
 * ¿Cómo funciona nuestro sistema de edición?
 * 1. Vista de Lectura: Normalmente, el dato se ve como un texto elegante con un icono de lápiz.
 * 2. El Modal: Al pulsar, aparece una "capa" sobre la web (Overlay) con un cuadro de texto. 
 *    Esto evita que el usuario se distraiga con el resto de la página mientras edita.
 * 3. Comunicación Dinámica: Usamos las llamadas "Props" (propiedades) para que el componente 
 *    hijo le avise al padre en cuanto el usuario confirma el cambio. 
 * 
 * Es una forma limpia y profesional de gestionar formularios sin recargar toda la interfaz.
 */
'use client';
import { useState } from 'react';
import styles from './EditableInfoModal.module.css';
import { MdOutlineModeEditOutline } from "react-icons/md";
import TertiaryButton from '../../Buttons/TertiaryButton/TertiaryButton';

export default function EditableField({ label, value, inputType = "text", onSave }) {
    // Estado para controlar la visibilidad de la ventana modal
    const [showModal, setShowModal] = useState(false);

    // Guardamos el valor temporalmente mientras el usuario escribe
    const [name, setName] = useState(value);

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
