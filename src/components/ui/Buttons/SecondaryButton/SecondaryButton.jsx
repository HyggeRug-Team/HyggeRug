// Componente reutilizable para nuestro botón secundario
// Ideal para acciones "outline" o secundarias en la página
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