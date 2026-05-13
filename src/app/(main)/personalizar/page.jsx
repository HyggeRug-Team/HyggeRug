/**
 * @file page.jsx (personalizar)
 * @description Página del formulario de personalización de alfombras.
 *
 * [Nuestro enfoque]
 * Hemos separado la lógica de servidor (obtener sesión) de la interactividad del cliente.
 * La sesión del usuario se pasa como prop para que el formulario sepa si alguien está
 * autenticado antes de permitir el envío.
 *
 * [Por qué lo hemos hecho así]
 * Necesitamos la sesión en el servidor para pasarla al componente cliente de forma segura,
 * evitando que usuarios anónimos puedan enviar pedidos.
 */
import React from 'react';
import { getSession } from '@/lib/auth';
import CustomOrderClient from '@/components/sections/CustomOrder/CustomOrderClient';

export const metadata = {
    title: 'Personalizar | Hygge Rug - Vuestros diseños hechos realidad',
    description: 'Enviadnos vuestro diseño, dibujo o foto y lo convertiremos en una alfombra artesanal de tufting única. Presupuesto personalizado sin compromiso.',
};

export default async function PersonalizarPage() {
    const session = await getSession();

    return (
        <main>
            <CustomOrderClient user={session} />
        </main>
    );
}
