/**
 * @file products.js
 * @description Gestión de datos del catálogo de alfombras.
 * 
 * [Nuestro enfoque]
 * Centralizamos aquí todas las consultas relacionadas con las alfombras. Nos aseguramos 
 * de que la información de precios y variantes esté siempre sincronizada con la DB.
 * 
 * [Por qué lo hemos hecho así]
 * Separamos la lógica de base de datos para que los componentes (Server o Client) no 
 * tengan que lidiar con SQL. Además, aplicamos filtros de seguridad (public=1) 
 * directamente en la fuente para evitar errores en el escaparate.
 */
import { db } from "@/lib/db";

/**
 * FUNCIÓN RECOLECTORA DEL ESCAPARATE DE PRODUCTOS
 * Extrae todas las alfombras de la base de datos, incluyendo su categoría.
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
                c.name AS category,
                COALESCE((
                    SELECT MIN(price)
                    FROM product_sizes ps
                    WHERE ps.product_id = p.product_id AND ps.active = 1
                ), p.base_price) AS min_price
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.public = 1 AND p.community = 1
        `);
    return rows;
  } catch (error) {
    throw new Error(
      `getProducts: error al obtener productos – ${error.message}`,
    );
  }
}

/**
 * FUNCIÓN PARA OBTENER LOS PRODUCTOS ALEATORIOS DEL HERO SECTION
 * Extrae hasta N productos aleatorios de la base de datos.
 * @param {number} limit - Cantidad de productos a extraer
 */
export async function getRandomProducts(limit = 7) {
  try {
    const [rows] = await db.query(
      `
            SELECT
                product_id,
                name,
                image_url
            FROM products
            WHERE image_url IS NOT NULL AND public = 1 AND community = 1
            ORDER BY RAND()
            LIMIT ?
        `,
      [limit],
    );
    return rows;
  } catch (error) {
    throw new Error(
      `getRandomProducts: error al obtener productos – ${error.message}`,
    );
  }
}

/* ─── FUNCIONES ADMIN ─────────────────────────────────────────────────────── */

export async function getAdminProducts() {
  const [rows] = await db.query(`
    SELECT
      p.product_id,
      p.name,
      p.description,
      p.image_url,
      p.base_price,
      p.public,
      p.community,
      p.category_id,
      c.name AS category,
      COUNT(ps.product_size_id) AS total_sizes,
      SUM(ps.active = 1)        AS active_sizes
    FROM products p
    LEFT JOIN categories c  ON c.category_id = p.category_id
    LEFT JOIN product_sizes ps ON ps.product_id = p.product_id
    GROUP BY p.product_id, p.name, p.description, p.image_url,
             p.base_price, p.public, p.community, p.category_id, c.name
    ORDER BY p.product_id DESC
  `);
  return rows;
}

export async function getAdminProductById(productId) {
  const [rows] = await db.query(`
    SELECT
      p.product_id, p.name, p.description, p.image_url,
      p.base_price, p.public, p.community, p.category_id,
      c.name AS category,
      ps.product_size_id AS size_id,
      ps.size AS size_label,
      ps.price AS size_price,
      ps.active AS size_active
    FROM products p
    LEFT JOIN categories c  ON c.category_id = p.category_id
    LEFT JOIN product_sizes ps ON ps.product_id = p.product_id
    WHERE p.product_id = ?
    ORDER BY ps.price ASC
  `, [productId]);

  if (!rows.length) return null;

  const product = {
    product_id: rows[0].product_id,
    name: rows[0].name,
    description: rows[0].description,
    image_url: rows[0].image_url,
    base_price: rows[0].base_price,
    public: rows[0].public,
    community: rows[0].community,
    category_id: rows[0].category_id,
    category: rows[0].category,
    sizes: [],
  };

  const seen = new Set();
  for (const row of rows) {
    if (row.size_id && !seen.has(row.size_id)) {
      seen.add(row.size_id);
      product.sizes.push({
        size_id: row.size_id,
        size_label: row.size_label,
        price: row.size_price,
        active: row.size_active,
      });
    }
  }
  return product;
}

export async function createProduct({ name, description, image_url, base_price, category_id, isPublic, community }) {
  const [result] = await db.query(
    `INSERT INTO products (name, description, image_url, base_price, category_id, public, community)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description || null, image_url || null, base_price, category_id || null, isPublic ? 1 : 0, community ? 1 : 0]
  );
  return result.insertId;
}

export async function updateProduct(productId, { name, description, image_url, base_price, category_id, isPublic, community }) {
  await db.query(
    `UPDATE products SET name=?, description=?, image_url=?, base_price=?, category_id=?, public=?, community=?
     WHERE product_id=?`,
    [name, description || null, image_url || null, base_price, category_id || null, isPublic ? 1 : 0, community ? 1 : 0, productId]
  );
}

export async function deleteProduct(productId) {
  const [orderRefs] = await db.query(
    `SELECT op.order_product_id FROM order_product op
     JOIN orders o ON op.order_id = o.order_id
     WHERE op.product_id = ? AND o.order_status != 'en_carrito'
     LIMIT 1`,
    [productId]
  );

  if (orderRefs.length > 0) {
    const err = new Error('El producto está asociado a pedidos existentes y no puede eliminarse.');
    err.code = 'PRODUCT_IN_USE';
    throw err;
  }

  await db.query(
    `DELETE op FROM order_product op
     JOIN orders o ON op.order_id = o.order_id
     WHERE op.product_id = ? AND o.order_status = 'en_carrito'`,
    [productId]
  );
  await db.query(`DELETE FROM product_sizes WHERE product_id = ?`, [productId]);
  await db.query(`DELETE FROM products WHERE product_id = ?`, [productId]);
}

export async function addProductSize(productId, { size, price }) {
  const [result] = await db.query(
    `INSERT INTO product_sizes (product_id, size, price, active) VALUES (?, ?, ?, 1)`,
    [productId, size, price]
  );
  return result.insertId;
}

export async function updateProductSize(sizeId, { size, price }) {
  await db.query(
    `UPDATE product_sizes SET size=?, price=? WHERE product_size_id=?`,
    [size, price, sizeId]
  );
}

export async function toggleProductSizeActive(sizeId) {
  await db.query(
    `UPDATE product_sizes SET active = 1 - active WHERE product_size_id=?`,
    [sizeId]
  );
}

export async function getCategories() {
  const [rows] = await db.query(`SELECT category_id, name FROM categories ORDER BY name`);
  return rows;
}

/* ─── FUNCIONES PÚBLICAS ──────────────────────────────────────────────────── */

/**
 * FUNCIÓN PARA OBTENER EL DEEP-DIVE DE UN PRODUCTO (Su foto, y tamaños)
 * Ideal para el panel de "Crear-Diseño" o la página de producto
 * @param {number} productId - El identificador numérico de tu base de datos
 */
export async function getProductWithSizes(productId) {
  try {
    const [rows] = await db.query(
      `
            SELECT
                p.product_id,
                p.name,
                p.description,
                p.base_price,
                p.image_url,
                c.name AS category,
                ps.product_size_id AS size_id,
                ps.size AS size_label,
                ps.price
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_sizes ps ON ps.product_id = p.product_id AND ps.active = 1
            WHERE p.product_id = ?
            ORDER BY ps.price ASC
        `,
      [productId],
    );

    if (!rows.length) return null;

    const product = {
      product_id: rows[0].product_id,
      name: rows[0].name,
      description: rows[0].description,
      base_price: rows[0].base_price,
      image_url: rows[0].image_url,
      category: rows[0].category,
      sizes: [],
    };

    const seenSizes = new Set();

    for (const row of rows) {
      if (row.size_id && !seenSizes.has(row.size_id)) {
        seenSizes.add(row.size_id);
        product.sizes.push({
          size_id: row.size_id,
          size_label: row.size_label,
          price: row.price,
        });
      }
    }

    return product;
  } catch (error) {
    throw new Error(
      `getProductWithSizes: error al obtener el producto ${productId} – ${error.message}`,
    );
  }
}
