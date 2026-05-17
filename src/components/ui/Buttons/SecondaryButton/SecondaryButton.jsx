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
 * 4. Navegación fluida: usamos <Link> de Next.js para evitar recargas.
 */
import React from 'react'
import styles from './SecondaryButton.module.css'
import { sanitizeHref } from '@/lib/url';
import Link from 'next/link';

function SecondaryButton({ text, url, Icon, onClick, className, variant, disabled }) {
    const combinedClassName = `${styles.secondaryBtn} ${variant ? styles[variant] : ''} ${className || ''}`;

    if (url) {
        const safeHref = sanitizeHref(url);
        return (
            <Link href={safeHref} className={combinedClassName} onClick={onClick}>
                <span>{text}</span>
                {Icon && <Icon size={18} />}
            </Link>
        );
    }

    return (
        <button type="button" className={combinedClassName} onClick={onClick} disabled={disabled}>
            <span>{text}</span>
            {Icon && <Icon size={18} />}
        </button>
    );
}

export default SecondaryButton