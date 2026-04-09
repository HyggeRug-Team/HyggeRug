/**
 * @file url.js
 * @description Utilidades para manejar URLs de forma segura en el cliente.
 *
 * [Nuestro enfoque]
 * Hemos centralizado la sanitización de `href` para que todos nuestros botones sigan
 * la misma política y evitemos repetir reglas en varios componentes.
 *
 * [Por qué lo hemos hecho así]
 * Así reducimos duplicación (DRY), minimizamos el riesgo de inconsistencias y hacemos
 * más fácil corregir la seguridad en un único punto si el proyecto crece.
 */

export function sanitizeHref(url) {
  if (typeof url !== 'string') return '#';

  // Permitimos únicamente:
  // - Anclas: #algo
  // - Rutas internas: /algo
  // - URLs externas con http(s)
  const isAllowed =
    url.startsWith('#') ||
    url.startsWith('/') ||
    url.startsWith('http://') ||
    url.startsWith('https://');

  return isAllowed ? url : '#';
}

