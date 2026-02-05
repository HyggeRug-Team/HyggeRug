// Típico mensajito cuqui de: "A tu gato le va a flipar" o cosas así
import React from 'react'
import styles from './CuteMessage.module.css';

// Le pasas el icono y el texto y listo el parche
function CuteMessage({Icon, text}) {
  return (
    <div className={styles.CuteMessage}>
      {Icon && <Icon size={28} className={styles.icon} />}
      <span className={styles.text}>{text}</span>
    </div>
  );
}

export default CuteMessage;