'use client';
import dynamic from 'next/dynamic';

/**
 * Aquí realizamos el wrapper para cargar la animación de entrada solo en el cliente.
 * Esto se encarga de que la web cargue súper rápido sin problemas en el servidor.
 */
const IntroOverlay = dynamic(() => import('./IntroOverlay'), {
  ssr: false,
});

export default IntroOverlay;
