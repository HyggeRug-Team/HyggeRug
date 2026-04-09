/**
 * @file Marquee.jsx
 * @description Galería con desplazamiento horizontal infinito (Efecto Loop).
 * 
 * [Nuestro enfoque]
 * Hemos creado este componente para simular un "escaparate infinito" donde nuestras 
 * alfombras no dejan de desfilar ante el usuario. 
 * 
 * [Por qué lo hemos hecho así]
 * 1. Duplicación del Contenido: En realidad, pintamos dos veces la misma lista de imágenes. 
 *    Cuando la primera lista sale por la izquierda, la segunda ya está entrando, 
 *    creando la ilusión de que no tiene fin.
 * 2. Animación CSS: En lugar de usar cálculos pesados de JavaScript, usamos una 
 *    animación CSS optimizada. Esto hace que el movimiento sea súper fluido, 
 *    como la seda, sin tirones.
 * 3. Versatilidad: Lo hemos programado para que sea "ciego" al contenido; podemos 
 *    meterle fotos, textos o logos, y él simplemente los hará desfilar a la velocidad 
 *    y dirección que queramos (`speed`, `direction`).
 */
import React from 'react';
import styles from './Marquee.module.css';

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
