'use client';
import dynamic from 'next/dynamic';

/**
 * Aquí realizamos el wrapper para cargar el fondo WebGL (Three.js) solo en el cliente.
 * Esto se encarga de que la web cargue súper rápido sin problemas en el servidor.
 */
const SilkBackground = dynamic(() => import('./SilkBackground'), {
  ssr: false,
});

export default SilkBackground;
