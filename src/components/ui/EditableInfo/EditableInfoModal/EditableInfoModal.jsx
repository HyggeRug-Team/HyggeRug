/**
 * @file EditableInfoModal.jsx
 * @description Campo interactivo que permite al usuario modificar sus datos de perfil
 * mediante una pequeña ventana modal posicionada sobre el propio formulario
 *
 * [Nuestro enfoque]
 * El componente funciona como disparador visual: al hacer clic en el valor actual
 * se abre un modal localizado con un input de edición y los botones de acción
 *
 * [Por qué lo hemos hecho así]
 * Al sincronizar el estado interno con el valor del servidor mediante useEffect,
 * garantizamos que el campo siempre refleje el dato más reciente tras guardar,
 * evitando desfases visuales entre la UI y la base de datos
 *
 * [Validaciones aplicadas]
 * - Email: debe cumplir el formato usuario@dominio.ext antes de guardar
 * - Nickname: entre 3 y 30 caracteres, solo letras, números, guion y guion bajo
 *   Sin espacios al inicio ni al final
 */
'use client';

import { useState, useEffect } from 'react';
import styles from './EditableInfoModal.module.css';
import { MdOutlineModeEditOutline } from "react-icons/md";
import TertiaryButton from '../../Buttons/TertiaryButton/TertiaryButton';

/* ── Constantes de validación ──────────────────────────────────── */

/* Regex de email simplificada basada en RFC 5322 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Regex de nickname: entre 3 y 30 caracteres, solo alfanumérico, guion y guion bajo */
const NICKNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

/* Devuelve true si el label corresponde al campo de correo electrónico */
const isEmailField = (label = '') =>
    label.toLowerCase().includes('correo') || label.toLowerCase().includes('email');

/* Devuelve true si el label corresponde al campo de nombre de usuario */
const isNicknameField = (label = '') =>
    label.toLowerCase().includes('nickname') ||
    label.toLowerCase().includes('llamamos') ||
    label.toLowerCase().includes('usuario');

/**
 * Comprueba si el valor introducido cumple las reglas del campo indicado por el label
 * Devuelve el mensaje de error correspondiente, o una cadena vacía si es válido
 *
 * @param {string} value - Valor a validar
 * @param {string} label - Etiqueta del campo que determina el tipo de validación
 * @returns {string} Mensaje de error o cadena vacía si todo es correcto
 */
function validate(value, label) {
    const trimmed = value.trim();

    if (isEmailField(label)) {
        if (!trimmed) return 'El correo no puede estar vacío';
        if (!EMAIL_REGEX.test(trimmed)) return 'Introduce un correo válido, ej: usuario@dominio.com';
    }

    if (isNicknameField(label)) {
        if (!trimmed) return 'El nombre de usuario no puede estar vacío';
        if (trimmed.length < 3) return 'El nickname debe tener al menos 3 caracteres';
        if (trimmed.length > 30) return 'El nickname no puede superar los 30 caracteres';
        if (!NICKNAME_REGEX.test(trimmed)) return 'Solo se permiten letras, números, guiones y guiones bajos';
    }

    return '';
}

export default function EditableField({ label, value, inputType = "text", onSave }) {

    /* Controla si la ventana modal está visible o no */
    const [showModal, setShowModal] = useState(false);

    /* Valor temporal del input mientras el usuario escribe; cae en cadena vacía si el padre no pasa nada */
    const [name, setName] = useState(value || "");

    /* Mensaje de error de validación que se muestra bajo el input */
    const [error, setError] = useState('');

    /* Si el valor del padre cambia (por ejemplo tras revalidar el servidor) actualizamos el estado local */
    useEffect(() => {
        setName(value || "");
    }, [value]);

    /* Abre el modal limpiando cualquier error que hubiera quedado de una edición anterior */
    const handleOpen = () => {
        setError('');
        setShowModal(true);
    };

    /* Valida el valor antes de enviarlo al servidor; solo llama a onSave si pasa la validación */
    const handleSave = () => {
        const validationError = validate(name, label);
        if (validationError) {
            setError(validationError);
            return;
        }
        if (onSave) onSave(name.trim());
        setShowModal(false);
    };

    /* Actualiza el valor del input y borra el error mientras el usuario escribe */
    const handleChange = (e) => {
        setName(e.target.value);
        if (error) setError('');
    };

    return (
        <div className={styles.row}>

            {/* Fila de visualización normal con el icono de edición */}
            <div className={styles.info}>
                <span className={styles.label}>{label}</span>
                <div className={styles.editBtn} onClick={handleOpen}>
                    <p className={styles.displayValue}>{name}</p>
                    <MdOutlineModeEditOutline />
                </div>
            </div>

            {/* Modal de edición — solo se monta en el DOM cuando showModal es true */}
            {showModal && (
                <div className={styles.modalOverlay}>

                    {/* Fondo oscuro semi-transparente que cierra el modal al hacer clic fuera */}
                    <div className={styles.backdrop} onClick={() => setShowModal(false)} />

                    <div className={styles.modalContent}>
                        <h3>Modificar {label}</h3>

                        <input
                            type={inputType}
                            className={`${styles.input} ${error ? styles.inputError : ''}`}
                            value={name}
                            onChange={handleChange}
                            autoFocus
                            aria-label={`Editar ${label}`}
                            aria-describedby={error ? 'field-error' : undefined}
                        />

                        {/* Mensaje de error de validación con estilo destacado */}
                        {error && (
                            <p id="field-error" className={styles.errorMessage}>
                                {error}
                            </p>
                        )}

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
