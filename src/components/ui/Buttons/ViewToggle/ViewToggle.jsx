/**
 * @file ViewToggle.jsx
 * @description Selector de modo de visualización (Grid/List).
 *
 * [Nuestro enfoque]
 * Este componente permite al usuario elegir cómo prefiere consumir el contenido, 
 * ya sea en una cuadrícula visual rápida o en una lista más detallada.
 *
 * [Por qué lo hemos hecho así]
 * 1. Flexibilidad: Mejora la experiencia de usuario al dar control sobre el layout.
 * 2. Diseño compacto: Agrupa los botones en una sola unidad visual tipo "segment control".
 * 3. Retroalimentación: Resalta claramente la opción activa.
 *
 * Props:
 * - currentView: El modo de vista activo ('grid' o 'list').
 * - onViewChange: Función para cambiar el modo de vista.
 */
"use client";

import React from 'react';
import { FaGrip, FaList } from 'react-icons/fa6';
import styles from './ViewToggle.module.css';

const ViewToggle = ({ currentView, onViewChange }) => {
    return (
        <div className={styles.viewToggleGroup}>
            <button 
                onClick={() => onViewChange('grid')}
                className={`${styles.viewToggleBtn} ${currentView === 'grid' ? styles.viewToggleBtnActive : ''}`}
                title="Vista Cuadrícula"
                type="button"
            >
                <FaGrip />
            </button>
            <button 
                onClick={() => onViewChange('list')}
                className={`${styles.viewToggleBtn} ${currentView === 'list' ? styles.viewToggleBtnActive : ''}`}
                title="Vista Lista"
                type="button"
            >
                <FaList />
            </button>
        </div>
    );
};

export default ViewToggle;
