/*
 * Componente: FloatingLabelInput
 * Descripción: Input de texto con etiqueta flotante
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
