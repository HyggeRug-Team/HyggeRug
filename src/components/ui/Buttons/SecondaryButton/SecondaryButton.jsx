/*
 * Componente: SecondaryButton
 * Descripción: Botón secundario con estilo 'outline' (bordeado) para acciones alternativas.
 */
import React from 'react'
import styles from './SecondaryButton.module.css'

function SecondaryButton({ text, url = "#", Icon, onClick }) {
    return (
            <a 
                href={url} 
                className={styles.secondaryBtn} 
                onClick={onClick} // Añadimos esto
            >
                <span>{text}</span>
                {Icon && <Icon size={18} />}
            </a>

    )
}

export default SecondaryButton