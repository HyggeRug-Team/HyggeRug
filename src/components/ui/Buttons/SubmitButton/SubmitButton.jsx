/**
 * @file SubmitButton.jsx
 * @description Botón especializado para el envío de formularios.
 *
 * [Nuestro enfoque]
 * Hemos diseñado este botón para que sea robusto y claro. Su función es enviar los datos de
 * Login/Registro sin que el usuario haga acciones repetidas por accidente.
 *
 * [Por qué lo hemos hecho así]
 * Incluimos bloqueos y micro-animaciones porque mejoran la experiencia (UX) y reducen cargas
 * innecesarias en el servidor.
 *
 * 1. Control de carga (`isLoading`): evitamos clics repetidos durante el proceso.
 * 2. Micro-animación: feedback inmediato al pulsar.
 * 3. Transiciones suaves: el texto cambia de forma consistente entre modos.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SubmitButton.module.css';

const SubmitButton = ({ isLoading, isLogin, textLogin, textRegister }) => {
  return (
    <motion.button
      layout
      type='submit'
      className={styles.submitBtn}
      disabled={isLoading}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isLogin ? 'entrar' : 'registrarme'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLogin ? textLogin : textRegister}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default SubmitButton;
