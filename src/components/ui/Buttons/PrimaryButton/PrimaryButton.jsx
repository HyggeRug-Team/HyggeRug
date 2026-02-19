/*
 * Componente: PrimaryButton
 * Descripción: Botón principal de la interfaz con estilos destacados. Admite texto, un icono opcional y una URL o acción onClick.
 */
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