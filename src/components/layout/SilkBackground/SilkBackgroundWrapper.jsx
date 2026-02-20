/*
 * Componente: SilkBackgroundWrapper
 * Descripción: Fondo oscuro consistente con el dashboard y el sidebar.
 *   - Sin Three.js, sin círculos de color
 *   - Mismo gradiente oscuro sutil que el resto de la app
 */
'use client';
import styles from './SilkBackground.module.css';

export default function SilkBackground() {
  return <div className={styles.silkBg} />;
}
