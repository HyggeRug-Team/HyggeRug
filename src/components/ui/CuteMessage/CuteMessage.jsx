/**
 * @file CuteMessage.jsx
 * @description Componente decorativo para transmitir el tono de voz de la marca.
 * 
 * [Nuestro enfoque]
 * En Hygge Rug no queremos ser una empresa fría y distante. Queremos conectar con el usuario. 
 * Hemos creado este componente para lanzar "mensajes cuquis" o cariñosos durante la navegación.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Identidad de Marca: El lenguaje gamberro pero artesanal es nuestra seña de identidad. 
 *    Usarlo en pequeños detalles hace que la experiencia sea única.
 * 2. Visual Hook: Al combinar un icono grande con un texto corto, creamos un punto 
 *    de atención visual que rompe la monotonía del diseño.
 * 3. Versatilidad: Lo usamos igual en el menú móvil que en el pie de página o en el panel de control.
 */
import React from 'react'
import styles from './CuteMessage.module.css';

function CuteMessage({Icon, text}) {
  return (
    <div className={styles.CuteMessage}>
      {Icon && <Icon size={24} className={styles.icon} />}
      <span className={styles.text}>{text}</span>
    </div>
  );
}

export default CuteMessage;