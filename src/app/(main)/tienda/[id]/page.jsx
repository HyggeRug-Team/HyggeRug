/**
 * PÁGINA DE DETALLE DE PRODUCTO (Server Component)
 * Obtiene los datos de la DB y renderiza la vista detallada.
 */
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
