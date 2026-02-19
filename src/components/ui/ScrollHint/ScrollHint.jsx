/*
 * Componente: ScrollHint
 * Descripción: Indicador visual animado (punto rebotando) para sugerir al usuario que haga scroll hacia abajo para ver más contenido.
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
