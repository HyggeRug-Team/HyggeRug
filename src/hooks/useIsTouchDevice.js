import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el dispositivo es táctil.
 * Utiliza matchMedia con '(pointer: coarse)' para una detección precisa.
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detectamos si el dispositivo coincide con un puntero "tosco" (touch)
    const mediaQuery = window.matchMedia('(pointer: coarse)');

    // Seteamos el valor inicial
    setIsTouch(mediaQuery.matches);

    // Escuchamos cambios (por si conectan/desconectan algo, aunque es raro)
    const handler = (e) => setIsTouch(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isTouch;
}
