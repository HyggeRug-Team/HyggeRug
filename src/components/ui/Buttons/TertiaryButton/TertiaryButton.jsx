/*
 * Componente: TertiaryButton
 * Descripción: Botón terciario para enlaces sutiles o acciones de menor jerarquía visual.
 */
import React from 'react'
import styles from './TertiaryButton.module.css'

function TertiaryButton({ text, url = "#", Icon, onClick }) {
    return (
        <a 
            href={url} 
            className={styles.terciaryBtn}
            onClick={onClick}
        >
            {Icon && <Icon size={18} />}
            <span>{text}</span>
        </a>
    )
}

export default TertiaryButton