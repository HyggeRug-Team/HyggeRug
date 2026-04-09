/**
 * @file SilkBackgroundWrapper.jsx
 * @description Wrapper de fondo oscuro consistente con la estética del panel.
 *
 * [Nuestro enfoque]
 * Hemos usado un componente “simple” solo para pintar el gradiente y así mantener
 * el fondo consistente, sin obligar a cargar librerías gráficas en todos los casos.
 *
 * [Por qué lo hemos hecho así]
 * Separar wrapper y fondo 3D nos permite controlar mejor el rendimiento y reducir
 * acoplamientos entre estilos y lógica de gráficos.
 */
'use client';
import styles from './SilkBackground.module.css';

export default function SilkBackground() {
  return <div className={styles.silkBg} />;
}
