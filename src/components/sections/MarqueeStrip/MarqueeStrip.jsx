/**
 * @file MarqueeStrip.jsx
 * @description Cinta deslizante (ticker) de texto continuo para separar visualmente secciones.
 *
 * [Nuestro enfoque]
 * Un componente visual que utiliza clones CSS para dar una ilusión de bucle infinito (marquee horizontal).
 *
 * [Por qué lo hemos hecho así]
 * En la cultura streetwear y urbana, estos 'tickers' son imprescindibles para aportar dinamismo 
 * visual rápido. Nos permite reiterar los valores nucleares ("Hecho Bajo Pedido", "Handmade") 
 * de forma agresiva y natural sin robar espacio de columnas de texto.
 */
import React from 'react';
import styles from './MarqueeStrip.module.css';

export default function MarqueeStrip() {
  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marqueeTrack}>
        <span>/// 100% HECHO A MANO EN MADRID /// LANA TÉCNICA PREMIUM /// DISEÑOS PERSONALIZADOS /// LABORATORIO IA /// CALIDAD ARTESANAL /// ENVÍOS SEGUROS /// PIEZAS ÚNICAS 1 DE 1 ///</span>
        <span>/// 100% HECHO A MANO EN MADRID /// LANA TÉCNICA PREMIUM /// DISEÑOS PERSONALIZADOS /// LABORATORIO IA /// CALIDAD ARTESANAL /// ENVÍOS SEGUROS /// PIEZAS ÚNICAS 1 DE 1 ///</span>
        <span>/// 100% HECHO A MANO EN MADRID /// LANA TÉCNICA PREMIUM /// DISEÑOS PERSONALIZADOS /// LABORATORIO IA /// CALIDAD ARTESANAL /// ENVÍOS SEGUROS /// PIEZAS ÚNICAS 1 DE 1 ///</span>
      </div>
    </div>
  );
}
