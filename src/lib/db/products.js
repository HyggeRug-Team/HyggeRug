// Archivo para conectar los Productos del catálogo con su info en base de datos.
// Se usa para extraer alfombras y variantes (tamaños, precios).
import { db } from '@/lib/db';

/**
 * FUNCIÓN RECOLECTORA DEL ESCAPARATE DE PRODUCTOS
 * Esto pide a la BBDD todas las Alfombras que estén con `is_active = TRUE`
 * @returns {Promise<Array>} Un listado limpio listo para usar en tu frontend (ej: TiendaPage)
 */
/**
 * FUNCIÓN RECOLECTORA DEL ESCAPARATE DE PRODUCTOS
 * Extrae todas las alfombras activas de la base de datos, incluyendo su categoría.
 * Realiza un JOIN con la tabla 'categories' para obtener el nombre legible.
 * @returns {Promise<Array>} Listado de productos enriquecido con categorías
 */
export async function getProducts() {
    try {
        const [rows] = await db.query(`
            SELECT
                p.product_id,
                p.name,
                p.description,
                p.base_price,
                p.image_url AS main_image,
                c.name AS category
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.is_active = TRUE
        `);
        return rows;
    } catch (error) {
        throw new Error(`getProducts: error al obtener productos – ${error.message}`);
    }
}

/**
 * FUNCIÓN PARA OBTENER LOS PRODUCTOS ALEATORIOS DEL HERO SECTION
 * Extrae hasta N productos aleatorios de la base de datos.
 * @param {number} limit - Cantidad de productos a extraer
 */
export async function getRandomProducts(limit = 7) {
    try {
        const [rows] = await db.query(`
            SELECT
                product_id,
                name,
                image_url
            FROM products
            WHERE is_active = TRUE AND image_url IS NOT NULL
            ORDER BY RAND()
            LIMIT ?
        `, [limit]);
        return rows;
    } catch (error) {
        throw new Error(`getRandomProducts: error al obtener productos – ${error.message}`);
    }
}

/**
 * FUNCIÓN PARA OBTENER EL DEEP-DIVE DE UN PRODUCTO (Su foto, y tamaños)
 * Ideal para el panel de "Crear-Diseño" o la página de producto
 * @param {number} productId - El identificador numérico de tu base de datos
 */
export async function getProductWithSizes(productId) {
    try {
        const [rows] = await db.query(`
            SELECT
                p.product_id,
                p.name,
                p.description,
                p.base_price,
                p.is_active,
                p.image_url,
                c.name AS category,
                s.size_id,
                s.dimensions AS size_label,
                ps.price,
                ps.stock_available
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_sizes ps ON ps.product_id = p.product_id
            LEFT JOIN sizes s ON ps.size_id = s.size_id
            WHERE p.product_id = ? AND p.is_active = TRUE
            ORDER BY ps.price ASC
        `, [productId]);

        if (!rows.length) return null;

        const product = {
            product_id:  rows[0].product_id,
            name:        rows[0].name,
            description: rows[0].description,
            base_price:  rows[0].base_price,
            image_url:   rows[0].image_url,
            category:    rows[0].category,
            is_active:   rows[0].is_active,
            sizes:       [], 
        };

        const seenSizes  = new Set();

        for (const row of rows) {
            if (row.size_id && !seenSizes.has(row.size_id)) {
                seenSizes.add(row.size_id);
                product.sizes.push({
                    size_id:         row.size_id,
                    size_label:      row.size_label,
                    price:           row.price,
                    stock_available: row.stock_available,
                });
            }
        }

        return product;
    } catch (error) {
        throw new Error(`getProductWithSizes: error al obtener el producto ${productId} – ${error.message}`);
    }
}
