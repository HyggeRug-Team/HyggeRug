import React from 'react';
import Link from 'next/link';
import styles from './Logo.module.css';

/**
 * Componente Logo Rediseñado ("Etiqueta de Marca")
 * 
 * Estilo: Modern Craft / Tufting Label
 * - Texto principal: Hygge (Rubik Bubbles)
 * - Texto secundario: Rug (Sans Serif Espaciado)
 * - Efecto: Etiqueta cosida con sombra dura.
 * 
 * @param {number|string} size - Tamaño base (ancho aprox). Controla la escala.
 * @param {boolean} noLink - Si es true, no envuelve en Link (para evitar anidamiento).
 * @param {string} variant - 'text' (completo) o 'compact' (solo siglas HR).
 */
function Logo({ size = 100, noLink = false, variant = 'text' }) {
  
  // Cálculo de escala para que 'size' tenga sentido visual
  // Si size=100, la fuente base será aprox 22px para que el bloque total mida cerca de 100px de ancho.
  // Ajustado a ojo: fontSize = size * 0.22
  const scale = typeof size === 'number' ? size * 0.22 : 20;

  const Content = (
    <div className={styles.logoLabel} style={{ fontSize: `${scale}px` }}>
      <span className={styles.logoTextMain}>HYGGE</span>
      <span className={styles.logoTextSub}>RUG</span>
      {/* Detalle decorativo: Hilo suelto de la etiqueta */}
      <div className={styles.thread}></div>
    </div>
  );

  const CompactContent = (
    <div 
      className={styles.logoCircle} 
      style={{ 
        width: size, 
        height: size, 
        fontSize: typeof size === 'number' ? size * 0.4 : '1rem' 
      }}
    >
      HR
    </div>
  );

  const FinalLogo = variant === 'compact' ? CompactContent : Content;

  if (noLink) {
    return <div style={{display: 'inline-block'}}>{FinalLogo}</div>;
  }

  return (
    <Link href="/" aria-label="Ir al inicio de Hygge Rug" style={{ textDecoration: 'none', display: 'inline-block' }}>
      {FinalLogo}
    </Link>
  );
}

export default Logo;