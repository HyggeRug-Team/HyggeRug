/*
 * Componente: StatsCard
 * Descripción: Tarjeta para mostrar estadísticas o datos numéricos relevantes con un icono representativo.
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