import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnimatedGrid.module.css';

/**
 * ANIMATED GRID (GENÉRICO)
 * Una cuadrícula que renderiza cualquier componente para una lista de ítems.
 */
const AnimatedGrid = ({ 
    items = [], 
    ItemComponent, // El componente que renderizará cada ítem
    itemProps = {} // Props adicionales que se quieran pasar a cada ítem
}) => {
    return (
        <motion.div layout className={styles.gridContainer}>
            <AnimatePresence mode='popLayout'>
                {items.map((item, index) => (
                    <ItemComponent 
                        key={item.id || index} 
                        {...item} 
                        {...itemProps}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default AnimatedGrid;
