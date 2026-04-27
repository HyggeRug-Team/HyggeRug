/**
 * @file AnimatedGrid.jsx
 * @description Cuadrícula animada genérica para renderizar listas de elementos.
 *
 * [Nuestro enfoque]
 * Este componente actúa como un contenedor inteligente que añade animaciones de 
 * entrada/salida a cualquier lista de componentes, facilitando la creación de 
 * galerías dinámicas.
 *
 * [Por qué lo hemos hecho así]
 * 1. Reutilización: Puede renderizar cualquier `ItemComponent` pasándole sus props.
 * 2. Fluidez: Utiliza AnimatePresence para que los cambios en la lista sean suaves.
 * 3. Simplicidad: Abstrae la lógica de animaciones de los componentes individuales.
 *
 * Props:
 * - items: Array de objetos con los datos a renderizar.
 * - ItemComponent: El componente React que se usará para cada ítem.
 * - itemProps: Props adicionales comunes para todos los ítems.
 * - className: Clase CSS personalizada para el contenedor.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnimatedGrid.module.css';
const AnimatedGrid = ({ 
    items = [], 
    ItemComponent, // El componente que renderizará cada ítem
    itemProps = {}, // Props adicionales que se quieran pasar a cada ítem
    className
}) => {
    return (
        <div className={className || styles.gridContainer}>
            <AnimatePresence>
                {items.map((item, index) => (
                    <ItemComponent 
                        key={item.id || index} 
                        {...item} 
                        {...itemProps}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedGrid;
