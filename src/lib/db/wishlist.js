/**
 * @file wishlist.js
 * @description Gestión de la lista de deseos (favoritos) de los usuarios.
 */
import { db } from '@/lib/db';

/**
 * AÑADIR UN PRODUCTO A FAVORITOS
 * @param {number} userId 
 * @param {number} productId 
 */
export async function addToWishlist(userId, productId) {
    try {
        const [result] = await db.query(
            'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`addToWishlist: error – ${error.message}`);
    }
}

/**
 * QUITAR UN PRODUCTO DE FAVORITOS
 * @param {number} userId 
 * @param {number} productId 
 */
export async function removeFromWishlist(userId, productId) {
    try {
        const [result] = await db.query(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`removeFromWishlist: error – ${error.message}`);
    }
}

/**
 * OBTENER LA LISTA DE DESEOS DE UN USUARIO
 * @param {number} userId 
 */
export async function getWishlist(userId) {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.product_id,
                p.name,
                p.description,
                p.base_price,
                p.image_url AS main_image,
                c.name AS category
            FROM wishlist w
            JOIN products p ON w.product_id = p.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE w.user_id = ?
            ORDER BY w.add_at DESC
        `, [userId]);
        return rows;
    } catch (error) {
        throw new Error(`getWishlist: error – ${error.message}`);
    }
}

/**
 * VERIFICAR SI UN PRODUCTO ESTÁ EN FAVORITOS
 * @param {number} userId 
 * @param {number} productId 
 */
export async function isInWishlist(userId, productId) {
    try {
        const [rows] = await db.query(
            'SELECT 1 FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        return rows.length > 0;
    } catch (error) {
        throw new Error(`isInWishlist: error – ${error.message}`);
    }
}
