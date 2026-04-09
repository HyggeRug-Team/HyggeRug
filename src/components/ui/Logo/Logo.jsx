/**
 * @file Logo.jsx
 * @description Identidad visual de la marca Hygge Rug.
 * 
 * [Nuestro enfoque]
 * El logotipo es el alma de cualquier marca. Para Hygge Rug, hemos querido que el logo 
 * no sea una simple imagen, sino que parezca una auténtica etiqueta de tela cosida a una alfombra.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Tipografía Mix: Combinamos letras redondeadas y divertidas ("HYGGE") con otras más serias y 
 *    espaciadas ("RUG") para reflejar que somos artesanos profesionales pero con un toque moderno.
 * 2. Detalles realistas: Si te fijas bien, la etiqueta tiene un pequeño "hilo suelto" decorativo. 
 *    Esto refuerza la idea del trabajo manual frente a lo fabricado en serie por máquinas.
 * 3. Versatilidad: Hemos programado el logo para que pueda ser gigante en la pantalla principal 
 *    o pequeñito y compacto en el móvil, adaptándose siempre con total nitidez.
 */
import React from 'react';
import Link from 'next/link';
import styles from './Logo.module.css';

function Logo({ size = 100, noLink = false, variant = 'text' }) {
  
  // Calculamos la escala visual basándonos en el tamaño que nos pidan (size)
  const scale = typeof size === 'number' ? size * 0.22 : 20;

  const Content = (
    <div className={styles.logoLabel} style={{ fontSize: `${scale}px` }}>
      <span className={styles.logoTextMain}>HYGGE</span>
      <span className={styles.logoTextSub}>RUG</span>
      {/* Detalle decorativo: Hilo suelto de la etiqueta que simula costura real */}
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