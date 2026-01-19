import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDown } from 'react-icons/io5';
import styles from './FooterDropdown.module.css';

// --- Definimos las animaciones fuera del componente (Variantes) ---

// Animación para el contenedor principal
const menuVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { when: "afterChildren" } // Espera a que los hijos se cierren antes de colapsar
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      type: "spring", bounce: 0.3, duration: 0.2,
      when: "beforeChildren", // Abre el contenedor antes de mostrar los hijos
      staggerChildren: 0.1 // CADA HIJO ENTRARÁ CON 0.1s DE RETRASO DEL ANTERIOR
    }
  }
};

// Animación para cada elemento de la lista individual
const itemVariants = {
  closed: { opacity: 0, y: -20 }, // Empiezan invisibles y un poco arriba
  open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};


const FooterDropdown = ({ titulo, opciones }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.dropdownWrapper}>
      <h3 onClick={() => setIsOpen(!isOpen)} className={styles.dropdownTitle}>
        {titulo}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <IoChevronDown className={styles.dropdownIcon} />
        </motion.div>
      </h3>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className={styles.dropdownList}
            // Conectamos las variantes
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ overflow: 'hidden' }} // Necesario
          >
            {opciones.map((opcion, index) => (
              // Cada hijo (motion.li) detectará automáticamente su variante "open" o "closed"
              <motion.li key={index} variants={itemVariants}>
                <a href={opcion.url} className={styles.dropdownLink}>{opcion.nombre}</a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FooterDropdown;