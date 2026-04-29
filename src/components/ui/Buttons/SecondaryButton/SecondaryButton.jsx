/**
 * @file SecondaryButton.jsx
 * @description Botón secundario para acciones alternativas o de segundo orden.
 *
 * [Nuestro enfoque]
 * Hemos diseñado este botón para acompañar al principal sin robarle protagonismo.
 * Por ejemplo, lo usamos en la página principal para “GALERÍA”.
 *
 * [Por qué lo hemos hecho así]
 * Elegimos un estilo “outline” para que el usuario distinga rápidamente prioridades
 * y mantenga la vista organizada sin saturarse de colores.
 *
 * 1. Outline: borde en vez de fondo para indicar “secundario”.
 * 2. Equilibrio visual: menos ruido visual y navegación más clara.
 * 3. Soporte de iconos: si hace falta, damos contexto sin añadir complejidad.
 */
import React from 'react'
import styles from './SecondaryButton.module.css'
import { sanitizeHref } from '@/lib/url';

function SecondaryButton({ text, url, Icon, onClick, className }) {
    const combinedClassName = `${styles.secondaryBtn} ${className || ''}`;

    if (url) {
        const safeHref = sanitizeHref(url);
        return (
            <a href={safeHref} className={combinedClassName} onClick={onClick}>
                <span>{text}</span>
                {Icon && <Icon size={18} />}
            </a>
        );
    }

    return (
        <button type="button" className={combinedClassName} onClick={onClick}>
            <span>{text}</span>
            {Icon && <Icon size={18} />}
        </button>
    );
}

export default SecondaryButton