// Aquí realizamos el botón terciario, que suele ser más pequeño o para enlaces menos importantes
import React from 'react'
import styles from './TerciaryBtn.module.css'

function TerciaryButton({ text, url = "#", Icon, onClick }) {
    return (
        <a 
            href={url} 
            className={styles.terciaryBtn} // Asegúrate de que en el CSS se llame así
            onClick={onClick}
        >
            {/* En el Terciario he mantenido el icono a la izquierda como en tu código original */}
            {Icon && <Icon size={18} />}
            <span>{text}</span>
        </a>
    )
}

export default TerciaryButton