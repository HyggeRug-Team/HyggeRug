
import React from 'react';
import styles from './Marquee.module.css';

// Componente Marquee para crear un efecto de desplazamiento infinito (loop)
// Perfecto para galerías o listas de logos.
const Marquee = ({ children, direction = 'left', speed = 30 }) => {
  return (
    <div className={styles.marqueeContainer}>
      <div 
        className={styles.marqueeTrack}
        style={{ 
            animationDuration: `${speed}s`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
      >
        <div className={styles.marqueeContent}>
            {children}
        </div>
        <div className={styles.marqueeContent}>
            {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
