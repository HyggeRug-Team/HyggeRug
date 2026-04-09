/**
 * @file StatusMessage.jsx
 * @description Indicador visual de mensajes de éxito o error en tiempo real.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este componente para que sea el medio de comunicación directa con el usuario 
 * durante el registro o el login. Es vital que el usuario sepa qué está pasando en cada momento.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Retroalimentación Inmediata: Si hay un error (ej. contraseña corta) o éxito (ej. cuenta creada), 
 *    el mensaje aparece con una animación suave para que sea lo primero que vea el usuario.
 * 2. Código de Colores: Usamos estilos distintos para que, de un solo vistazo, el usuario diferencie 
 *    un problema (Rojo) de un mensaje positivo (Verde).
 * 3. Animaciones con `AnimatePresence`: Si el mensaje cambia o desaparece, no lo hace "de golpe". 
 *    Framer Motion se encarga de que se desvanezca elegantemente, evitando saltos visuales bruscos.
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
