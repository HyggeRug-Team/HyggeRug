import React from 'react';
import styles from './ResultsInfo.module.css';

/**
 * COMPONENTE GENÉRICO DE INFORMACIÓN DE ESTADO / RESULTADOS
 */
const ResultsInfo = ({ 
    message = "Mostrando resultados", 
    subMessage 
}) => {
    return (
        <div className={styles.resultsInfoCenter}>
            <p className={styles.resultCount}>
                {message}
            </p>
            {subMessage && <p className={styles.subMessage}>{subMessage}</p>}
        </div>
    );
};

export default ResultsInfo;
