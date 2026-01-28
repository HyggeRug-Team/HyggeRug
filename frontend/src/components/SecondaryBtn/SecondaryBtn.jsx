// El componente ocupa el 100% del ancho por lo que hay que meterlo en un div con el tamaño que queramos
// Es la mejor forma que he encontrado de poder controlar el ancho del boton y que no siempre sea el mismo
import React from 'react'
import styles from './SecondaryBtn.module.css'

function SecondaryButton({text, url, Icon}) {
    return (
        <>
            <a href={url} className={styles.secondaryBtn}>
                <span>{text}</span>
                {Icon && <Icon size={18} />}
            </a>
        </>
    )
}

export default SecondaryButton