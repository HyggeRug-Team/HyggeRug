/**
 * @file page.jsx (FAQ)
 * @description Centro de Ayuda de Hygge Rug.
 *
 * [Nuestro enfoque]
 * Esta página actúa como un Server Component que inyecta los datos iniciales 
 * de las dudas más frecuentes y gestiona el SEO.
 *
 * [Por qué lo hemos hecho así]
 * Para maximizar la indexación de preguntas específicas sobre tufting y personalización, 
 * delegando la búsqueda dinámica al componente cliente FaqBlogFeed.
 */

import React from 'react';
import FaqBlogFeed from '@/components/sections/FAQ/FaqBlogFeed';

export const metadata = {
    title: 'Preguntas Frecuentes | Hygge Rug - Guía de Tufting y Pedidos',
    description: 'Resuelve tus dudas sobre cómo limpiar tu alfombra, plazos de envío, seguridad en los pagos y el proceso de diseño con IA en Hygge Rug.',
    keywords: 'FAQ, Ayuda, Hygge Rug, Tufting Madrid, alfombras personalizadas, limpieza alfombras, procesos IA'
};

export default function PublicFaqPage() {
    const faqs = [
        { 
            id: 1, 
            cat: 'PEDIDOS', 
            q: '¿Cuánto tarda mi pedido en llegar?', 
            a: 'Cada alfombra es una pieza de artesanía única fabricada mediante tufting manual. El proceso de creación toma entre 5 y 10 días laborables, a los que hay que sumar unas 48h de envío una vez sale del taller en Madrid.',
            date: 'MAYO 2026'
        },
        { 
            id: 2, 
            cat: 'DISEÑO', 
            q: '¿Cómo debo limpiar mi alfombra Hygge?', 
            a: 'Recomendamos usar aspiradora regularmente para mantener las fibras vivas. Para manchas accidentales, usa un paño húmedo con jabón neutro. Evita productos químicos agresivos que puedan dañar la lana técnica.',
            date: 'ABRIL 2026'
        },
        { 
            id: 3, 
            cat: 'PAGOS', 
            q: '¿Es seguro realizar el pago en la web?', 
            a: 'Totalmente. Utilizamos Stripe como pasarela de pago, líder mundial en seguridad, para que tus datos bancarios nunca se almacenen en nuestros servidores y el proceso sea 100% cifrado.',
            date: 'MAYO 2026'
        },
        { 
            id: 4, 
            cat: 'DISEÑO', 
            q: '¿Se despelucha la alfombra con el tiempo?', 
            a: 'Es normal que las alfombras de tufting suelten algo de fibra sobrante durante las primeras semanas. Con un aspirado regular, este proceso cesará y la pieza mantendrá su densidad original.',
            date: 'MARZO 2026'
        }
    ];

    return <FaqBlogFeed faqs={faqs} />;
}
