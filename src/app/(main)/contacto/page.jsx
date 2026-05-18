/**
 * @file page.jsx (Contacto)
 * @description Punto de contacto oficial con el taller de Hygge Rug.
 *
 * [Nuestro enfoque]
 * Hemos diseñado esta página como un Server Component para maximizar el SEO, 
 * inyectando la metadata necesaria y recuperando los enlaces de redes sociales 
 * antes de renderizar la vista interactiva.
 *
 * [Por qué lo hemos hecho así]
 * Queremos que la página sea fácilmente indexable por términos como "Tufting Madrid", 
 * delegando la interactividad del formulario al componente de cliente pero manteniendo 
 * el control de los datos globales en el servidor.
 */

import React from 'react';
import ContactView from '@/components/sections/Contact/ContactView';
import { getConfigValues } from '@/lib/db/config';

export const metadata = {
    title: 'Contacto | Hygge Rug - Tu taller de Tufting en Madrid',
    description: '¿Tienes una idea para una alfombra personalizada? ¿Dudas con tu pedido? Habla directamente con el taller de Hygge Rug en Madrid. Artesanía urbana a tu alcance.',
    keywords: 'Contacto, Hygge Rug, Tufting Madrid, alfombras personalizadas, taller artesanal, Madrid, decoración urbana'
};

export default async function ContactoPage() {
    const config = await getConfigValues(['social_instagram', 'social_tiktok', 'contact_email']);
    return <ContactView socialLinks={config} />;
}
