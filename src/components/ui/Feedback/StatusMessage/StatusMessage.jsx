/*
 * Componente: StatusMessage
 * Descripción: Muestra mensajes de éxito o error.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './StatusMessage.module.css';

const StatusMessage = ({ message, type }) => {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`${styles.message} ${styles[type]}`}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default StatusMessage;
