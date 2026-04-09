/**
 * @file SectionWrapper.jsx
 * @description Contenedor unificado para las diferentes secciones del panel de usuario.
 * 
 * [Nuestro enfoque]
 * Hemos creado este componente para no tener que estar definiendo el diseño de cada 
 * sección desde cero. Es como un "marco" donde metemos el contenido de la web.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Estética Coherente: Todas las partes del panel tienen el mismo margen, el mismo color 
 *    de fondo y el mismo estilo. Esto evita que la web parezca un puzle mal montado.
 * 2. Limpieza de Código: En lugar de repetir las mismas clases CSS en 10 archivos distintos, 
 *    las tenemos centralizadas aquí (DRY). Si algún día queremos que los bordes sean más redondeados, 
 *    solo tenemos que cambiarlo en este archivo y ¡tachán!, se actualiza en toda la web.
 */
import React from 'react';
import styles from './SectionWrapper.module.css';

function SectionWrapper({ children }) {
  return (
    <div className={styles.wrapContainer}>
      {children}
    </div>
  )
}

export default SectionWrapper;