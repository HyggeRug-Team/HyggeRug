/*
 * Componente: SubmitButton
 * Descripción: Botón de envío grande
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
