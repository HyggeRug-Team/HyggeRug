// Aquí realizamos el botón terciario, que suele ser más pequeño o para enlaces menos importantes
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