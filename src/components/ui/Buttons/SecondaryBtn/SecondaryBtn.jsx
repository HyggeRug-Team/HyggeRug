// Aquí realizamos nuestro botón secundario para acciones que no son las principales
import React from 'react'
import styles from './SecondaryBtn.module.css'

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