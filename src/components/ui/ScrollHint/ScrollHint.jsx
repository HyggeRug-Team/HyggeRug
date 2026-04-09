/**
 * @file ScrollHint.jsx
 * @description Indicador visual animado que invita a hacer scroll hacia abajo.
 *
 * [Nuestro enfoque]
 * Hemos creado un “toque” visual pequeño para que el usuario entienda que hay contenido
 * más abajo sin necesidad de instrucciones de texto.
 *
 * [Por qué lo hemos hecho así]
 * Mantenerlo como componente evita repetir estilos y nos permite ajustar la animación en
 * un único sitio.
 */
import React from "react";
import styles from "./ScrollHint.module.css";
import { motion } from "framer-motion";


// Componente sencillo para indicar al usuario que puede hacer scroll hacia abajo
function ScrollHint() {
    return (
        <motion.div 
          className={styles.scrollHint}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <motion.div 
            className={styles.scrollDot}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          ></motion.div>
          DESLIZA
        </motion.div>
    );
}

export default ScrollHint;
