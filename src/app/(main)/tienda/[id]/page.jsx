/**
 * @file page.jsx (Detalle de Producto)
 * @description Vista individual de una alfombra del catálogo.
 *
 * [Nuestro enfoque]
 * Utilizamos generateMetadata para inyectar dinámicamente el nombre y la descripción 
 * del producto en los motores de búsqueda y redes sociales.
 *
 * [Por qué lo hemos hecho así]
 * Cada diseño es único. Tener metadatos específicos para cada ID mejora 
 * drásticamente el SEO de larga cola (long-tail keywords).
 */

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProductWithSizes(id);
    
    if (!product) return { title: 'Producto no encontrado' };

    return {
        title: `${product.name} | Alfombra Artesanal`,
        description: product.description || `Diseño exclusivo de tufting: ${product.name}. Hecho a mano por Hygge Rug en Madrid.`,
        openGraph: {
            images: [product.image_url ?? '/rug-mario.png'],
        },
    };
}
import React from 'react';
import { notFound } from 'next/navigation';
import { getProductWithSizes } from '@/lib/db/products';
import ProductDetailClient from '../../../../components/store/ProductDetail/ProductDetailClient';

export default async function ProductPage({ params }) {
    const { id } = await params;
    
    // 1. Obtención de datos profundos
    let product = null;
    try {
        product = await getProductWithSizes(id);
    } catch (error) {
        console.error('Error cargando producto:', error);
    }

    if (!product) {
        notFound();
    }

    // 2. Normalización básica
    const normalizedProduct = {
        id: product.product_id,
        name: product.name,
        description: product.description,
        basePrice: product.base_price,
        image: product.image_url ?? '/rug-mario.png',
        category: product.category ?? 'ALFOMBRA',
        requestedBy: product.requested_by ?? 'Comunidad Hygge',
        sizes: product.sizes.map(s => ({
            id: s.size_id,
            label: s.size_label,
            price: s.price,
            stock: s.stock_available
        }))
    };

    return <ProductDetailClient product={normalizedProduct} />;
}
