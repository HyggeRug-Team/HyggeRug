/**
 * @file page.jsx (Tienda)
 * @description Página de la galería de diseños de la comunidad.
 *
 * [Nuestro enfoque]
 * Siguiendo el patrón del proyecto, esta página es un Server Component que ensambla
 * las secciones necesarias. Obtiene los datos de la BD y los inyecta en StoreSection.
 *
 * [Por qué lo hemos hecho así]
 * 1. Consistencia: Mismo patrón que la Home (ensamblaje de secciones).
 * 2. SEO: Los metadatos y la carga inicial de datos ocurren en el servidor.
 * 3. Modularidad: La lógica visual está en componentes de la carpeta /sections.
 */
import React from 'react';
import { getProducts } from '@/lib/db/products';
import HeroSplit from '@/components/sections/Shop/HeroSplit/HeroSplit';
import StoreSection from '@/components/sections/Shop/StoreSection/StoreSection';

export default async function TiendaPage() {
    let products = [];
    try {
        products = await getProducts();
    } catch (error) {
        console.error('TiendaPage: error al cargar productos', error);
    }

    // Normalización de datos para los componentes visuales
    const normalizedProducts = products.map((p) => ({
        id:          p.product_id,
        title:       p.name,
        description: p.description,
        price:       `${parseFloat(p.base_price).toFixed(2)}€`,
        image:       p.main_image ?? '/rug-mario.png',
        category:    p.category ?? 'ALFOMBRA',
        requestedBy: p.requested_by ?? null,
    }));

    return (
        <>
            <HeroSplit 
                tag="GALERÍA COLECTIVA"
                title="COLECCIÓN"
                titleAccent="COLECTIVA"
                subtitle="IDEAS QUE TOMAN FORMA"
                description="Este no es un catálogo convencional. Cada pieza nació de la imaginación de un cliente. Si te gusta una idea ajena, puedes pedirla. O mejor aún, cuéntanos la tuya."
                primaryAction={{
                    label: "PERSONALIZAR LA MÍA",
                    link: "/studio"
                }}
            />
            <StoreSection products={normalizedProducts} />
        </>
    );
}
