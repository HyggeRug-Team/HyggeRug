/**
 * @file CustomSelect.jsx
 * @description Componente de selección personalizado con estilo premium y animaciones.
 *
 * [Nuestro enfoque]
 * Hemos creado este selector para sustituir los selects nativos del navegador, que suelen 
 * romper la estética "dark & premium" de nuestra web. Permite una personalización total 
 * de colores, bordes y animaciones.
 *
 * [Por qué lo hemos hecho así]
 * 1. Consistencia visual: Mantiene el lenguaje de diseño de toda la aplicación.
 * 2. Control total: Podemos animar la apertura y cierre con Framer Motion.
 * 3. Accesibilidad: Aunque es personalizado, se comporta como un botón que despliega opciones.
 *
 * Props:
 * - value: El valor seleccionado actualmente.
 * - options: Array de objetos { value, label }.
 * - onChange: Función que se ejecuta al seleccionar una opción.
 * - placeholder: Texto a mostrar si no hay nada seleccionado.
 */
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ value, options, onChange, placeholder = "Seleccionar..." }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={styles.customSelectWrapper}>
            <button 
                className={styles.customSelectBtn} 
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                {selectedOption ? selectedOption.label : placeholder}
                <FaChevronDown className={`${styles.selectIcon} ${isOpen ? styles.selectIconOpen : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={styles.customSelectDropdown}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {options.map(option => (
                            <button
                                key={option.value}
                                className={`${styles.customSelectOption} ${value === option.value ? styles.customSelectOptionActive : ''}`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                type="button"
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
