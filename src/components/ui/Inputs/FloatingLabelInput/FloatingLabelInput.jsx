/**
 * @file FloatingLabelInput.jsx
 * @description Componente de entrada de texto con etiqueta animada (Label) que flota al escribir.
 * 
 * [Nuestro enfoque]
 * Hemos creado este tipo de entrada de texto porque es mucho más elegante y profesional que las normales.
 * [Por qué lo hemos hecho así]
 * Cuando hacemos clic para empezar a escribir, la etiqueta (el nombre del campo) 
 * "salta" hacia arriba de forma fluida.
 * 
 * Esto nos permite dos cosas:
 * 1. Ahorrar espacio: No necesitamos poner un título encima de cada cuadro de texto.
 * 2. Mejorar la experiencia: El usuario nunca olvida qué está escribiendo, porque el título 
 *    sigue ahí arriba vigilando. ¡Es lo que se llama un diseño eficiente y moderno!
 */
import React from 'react';
import styles from './FloatingLabelInput.module.css';

const FloatingLabelInput = ({ type, id, name, value, onChange, placeholder, required, minLength, label }) => {
  return (
    <div className={styles.inputGroup}>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || " "}
        required={required}
        minLength={minLength}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default FloatingLabelInput;
