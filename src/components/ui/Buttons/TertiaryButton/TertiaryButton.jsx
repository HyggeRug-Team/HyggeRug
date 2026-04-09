/**
 * @file TertiaryButton.jsx
 * @description Botón de utilidad para acciones de tercer orden o enlaces discretos.
 *
 * [Nuestro enfoque]
 * Hemos creado este botón para opciones necesarias pero que no queremos que distraigan.
 * Por ejemplo, enlaces de ayuda o “volver atrás” en un formulario.
 *
 * [Por qué lo hemos hecho así]
 * Usamos un estilo ligero para que el usuario entienda la jerarquía de acciones:
 * primero lo importante, luego lo secundario.
 *
 * 1. Menor peso visual: menos bordes y menos color.
 * 2. Limpieza de interfaz: evita que la pantalla parezca saturada.
 */
import React from 'react'
import styles from './TertiaryButton.module.css'
import { sanitizeHref } from '@/lib/url';

function TertiaryButton({ text, url = "#", Icon, onClick }) {
    const safeHref = sanitizeHref(url);

    return (
        <a 
            href={safeHref} 
            className={styles.terciaryBtn}
            onClick={onClick}
        >
            {Icon && <Icon size={18} />}
            <span>{text}</span>
        </a>
    )
}

export default TertiaryButton