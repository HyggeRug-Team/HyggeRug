'use client';
import styles from './SilkBackground.module.css';

/* 
  Fondo optimizado con CSS puro - Mucho más ligero que Three.js
  Nosotros priorizamos el rendimiento sin sacrificar la estética
*/
export default function SilkBackground() {
  return (
    <div className={styles.silkBg}>
      <div className={styles.gradient1}></div>
      <div className={styles.gradient2}></div>
      <div className={styles.gradient3}></div>
      <div className={styles.noise}></div>
    </div>
  );
}
