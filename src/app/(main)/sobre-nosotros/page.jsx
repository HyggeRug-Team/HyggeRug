/**
 * @file page.jsx (Sobre Nosotros)
 * @description Página de "Sobre Nosotros" de Hygge Rug.
 * 
 * [Nuestro enfoque]
 * Esta página es un Server Component que gestiona los metadatos SEO y delega 
 * la renderización visual al componente cliente AboutUsView.
 *
 * [Por qué lo hemos hecho así]
 * Para permitir que los motores de búsqueda indexen correctamente la historia de la marca 
 * y las palabras clave de artesanía sin sacrificar la interactividad.
 */

import React from 'react';
import AboutUsView from '@/components/sections/AboutUsView/AboutUsView';

export const metadata = {
  title: 'Sobre Nosotros | El Alma de Hygge Rug',
  description: 'Conoce la historia detrás de Hygge Rug, un taller unipersonal en Madrid dedicado al tufting artesanal. Descubre cómo convertimos tus ideas e IA en alfombras únicas.',
  keywords: 'tufting, artesano Madrid, Hygge Rug, alfombras personalizadas, historia de marca, craft movement'
};

export default function AboutUsPage() {
  return <AboutUsView />;
}
