// Es el componente que estás usando como contenedor en el dashboard, solo tiene el estilo de colores y el padding , no es ni flex ni nada
import React from 'react';
import styles from './SectionWrapper.module.css';
function SectionWrapper({ children  }) {
  return (
    <div className={styles.wrapContainer}>
      {children}
      {/*
          Para usar el componente lo importas y lo usas asi: 
          <SectionWrapper>
              Aqui metes lo que te de la gana pero ya va a estar en un div con el estilo unificado
          <SectionWrapper/>
      */}
    </div>
  )
}

export default SectionWrapper