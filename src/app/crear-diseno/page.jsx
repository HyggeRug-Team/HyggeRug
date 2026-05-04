/**
 * @file page.jsx (Laboratorio IA)
 * @description Herramienta de diseño personalizado con inteligencia artificial.
 *
 * [Nuestro enfoque]
 * Esta página es el núcleo tecnológico de Hygge Rug. Permite al usuario generar 
 * bocetos únicos para sus alfombras.
 *
 * [Por qué lo hemos hecho así]
 * Separamos el StudioView (Client) de esta página (Server) para inyectar 
 * metadatos SEO que posicionen a Hygge Rug como referente en "IA + Tufting".
 */

import React from 'react';
import StudioView from '@/components/sections/Studio/StudioView';

export const metadata = {
    title: 'Laboratorio IA | Crea tu Alfombra Personalizada',
    description: 'Usa nuestra inteligencia artificial para diseñar tu alfombra única. Sube una imagen, describe tu estilo y nosotros la fabricamos con tufting artesanal en Madrid.',
    keywords: 'diseñar alfombra IA, laboratorio textil, tufting inteligente, alfombras personalizadas Madrid, generador diseños alfombras'
};

export default function CrearDisenoPage() {
    return <StudioView />;
}
