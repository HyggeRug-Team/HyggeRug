// Componente para nuestro botón principal de la web.
// Se adapta al contenido manteniendo siempre su presencia.
import React from 'react'
import styles from './PrimaryButton.module.css'

function PrimaryButton({text, url, Icon, onClick}) {
    return (
        <>
            <a href={url} className={styles.primaryBtn} onClick={onClick}>
                {Icon && <Icon size={18} />}
                <span>{text}</span>
            </a>
        </>
    )
}


export default PrimaryButton