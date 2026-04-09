/**
 * @file PrimaryButton.jsx
 * @description Botón principal (CTA) con el estilo visual más fuerte de la marca.
 *
 * [Nuestro enfoque]
 * Hemos creado este botón para las acciones más importantes de la web, como “DISEÑAR”.
 * Lo diseñamos como componente reutilizable para que en toda la aplicación tenga el
 * mismo tamaño, color y comportamiento.
 *
 * [Por qué lo hemos hecho así]
 * Elegimos esta estructura para mantener consistencia visual y evitar “duplicar” estilos en
 * varios archivos (menos errores y más mantenimiento).
 *
 * 1. Consistencia visual: mismo look y comportamiento.
 * 2. Diseño atómico: lo podemos reutilizar sin romper el layout.
 * 3. Interactividad: incluye efectos de hover para que el usuario lo identifique como clicable.
 */
import React from 'react'
import styles from './PrimaryButton.module.css'
import { sanitizeHref } from '@/lib/url';

function PrimaryButton({text, url, Icon, onClick}) {
    const safeHref = sanitizeHref(url);

    return (
        <>
            <a href={safeHref} className={styles.primaryBtn} onClick={onClick}>
                {Icon && <Icon size={18} />}
                <span>{text}</span>
            </a>
        </>
    )
}


export default PrimaryButton