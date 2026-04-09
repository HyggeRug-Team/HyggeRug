/**
 * @file StatsCard.jsx
 * @description Tarjeta compacta para mostrar una estadística (número + texto) con un icono.
 *
 * [Nuestro enfoque]
 * Hemos creado este componente para que los KPIs del dashboard mantengan el mismo estilo y
 * para no repetir la misma estructura en cada página.
 *
 * [Por qué lo hemos hecho así]
 * Reutilizar tarjetas reduce errores visuales y facilita cambiar diseño en un solo lugar.
 */
import React from 'react';
import styles from "./StatsCard.module.css";

function StatsCard({ bigText, smallText, color, Icon}) {
    return (
        <div className={styles.statCard}
        style={{ '--card-color': color }}>
            <div className={styles.statInfo}>
                <h3>{bigText}</h3>
                <p>{smallText}</p>
            </div>
            <div className={styles.statIconWrapper}>
                <Icon/>
            </div>
        </div>
    )
}

export default StatsCard