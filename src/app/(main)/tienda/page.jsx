// Server Component — lee los productos de la BD y pasa los datos como props al client
/**
 * PÁGINA DE LA GALERÍA DE DISEÑOS (Server Component)
 * Se encarga de la obtención de datos desde la base de datos (TidbCloud)
 * y de preparar los objetos para el componente de cliente.
 */
import React from 'react';
import { getProducts } from '@/lib/db/products';
import TiendaClient from './TiendaClient';

export default async function TiendaPage() {
    // 1. Obtención de productos base desde la BBDD
    let products = [];
    try {
        products = await getProducts();
    } catch (error) {
        console.error('TiendaPage: error al cargar productos', error);
    }

    // 2. NORMALIZACIÓN DE DATOS:
    // Adaptamos el esquema de la BBDD a la interfaz que espera el componente visual.
    // Esto nos permite cambiar la BBDD en el futuro sin romper el diseño.
    const normalizedProducts = products.map((p) => ({
        id:          p.product_id,
        title:       p.name,
        description: p.description,
        price:       `${parseFloat(p.base_price).toFixed(2)}€`,
        image:       p.main_image ?? '/rug-mario.png',
        category:    p.category ?? 'ALFOMBRA',
        requestedBy: p.requested_by ?? null,
    }));

    // 3. Renderizamos el cliente interactivo
    return <TiendaClient products={normalizedProducts} />;
}
