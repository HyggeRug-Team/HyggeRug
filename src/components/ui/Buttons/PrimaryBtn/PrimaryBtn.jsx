// Aquí realizamos el botón principal de la web. Ocupa el 100% del ancho para que podamos controlarlo desde fuera.
// Esto se encarga de ser flexible y que no siempre tenga el mismo tamaño.
import React from 'react'
import styles from './PrimaryBtn.module.css'

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