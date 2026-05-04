/**
 * @file page.jsx (Contacto)
 * @description Punto de contacto oficial con el taller de Hygge Rug.
 *
 * [Nuestro enfoque]
 * Esta página es un Server Component que inyecta la metadata SEO y renderiza 
 * la vista interactiva de contacto.
 *
 * [Por qué lo hemos hecho así]
 * Permite que la página sea indexada correctamente por motores de búsqueda bajo 
 * términos como "Tufting Madrid" o "Contacto Hygge Rug", manteniendo la interactividad 
 * avanzada en el lado del cliente.
 */

import React from 'react';
import ContactView from '@/components/sections/Contact/ContactView';

export const metadata = {
    title: 'Contacto | Hygge Rug - Tu taller de Tufting en Madrid',
    description: '¿Tienes una idea para una alfombra personalizada? ¿Dudas con tu pedido? Habla directamente con el taller de Hygge Rug en Madrid. Artesanía urbana a tu alcance.',
    keywords: 'Contacto, Hygge Rug, Tufting Madrid, alfombras personalizadas, taller artesanal, Madrid, decoración urbana'
};

export default function ContactoPage() {
    return <ContactView />;
}
