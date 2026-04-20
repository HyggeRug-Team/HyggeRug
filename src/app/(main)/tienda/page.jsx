// Server Component — lee los productos de la BD y pasa los datos como props al client
import { getProducts } from '@/lib/db/products';
import TiendaClient from './TiendaClient';

export default async function TiendaPage() {
    let products = [];
    try {
        products = await getProducts();
    } catch (error) {
        console.error('TiendaPage: error al cargar productos', error);
    }

    // Normaliza a la forma que espera ProductCard / TiendaClient
    const normalizedProducts = products.map((p) => ({
        id:       p.product_id,
        title:    p.name,
        price:    `${parseFloat(p.base_price).toFixed(2)}€`,
        status:   'DISPONIBLE',
        image:    p.main_image ?? '/rug-mario.png',
        category: 'ALFOMBRA',
    }));

    return <TiendaClient products={normalizedProducts} />;
}
