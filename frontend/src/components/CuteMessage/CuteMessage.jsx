// Se usa para todos los mensajes del estilo de: "Tu gato lo va a amar" y esas cosass
import React from 'react'
import styles from './CuteMessage.module.css';

// Recibe el icono que debemos importar en el componente donde se vaya a usar y el texto
// <CuteMessage Icon={IconoImportado} text="Texto de ejemplo"
// Icon empieza por mayuscula por que es un componente
function CuteMessage({Icon, text}) {
  return (
    <div className={styles.CuteMessage}>
      {Icon && <Icon size={28} className={styles.icon} />}
      <span className={styles.text}>{text}</span>
    </div>
  );
}

export default CuteMessage;