/*
 * Componente: SilkBackgroundWrapper
 * Descripción: Versión optimizada y ligera del fondo de seda utilizando puramente CSS y gradientes. Usada como alternativa de alto rendimiento al fondo de Three.js.
 */
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
