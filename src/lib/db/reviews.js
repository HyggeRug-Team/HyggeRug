/**
 * @file reviews.js
 * @description Gestión de valoraciones y comentarios de productos.
 * 
 * [Nuestro enfoque]
 * Permitimos que los usuarios valoren los productos para construir una comunidad 
 * basada en la confianza y el feedback real.
 * 
 * [Por qué lo hemos hecho así]
 * Las valoraciones ayudan a otros compradores a decidirse y a nosotros a mejorar 
 * la calidad de nuestros diseños.
 */

import { db } from '@/lib/db';

/**
 * OBTIENE LAS VALORACIONES DE UN PRODUCTO
 * @param {number|string} productId - ID del producto
 * @returns {Promise<Array>} Lista de comentarios
 */
export async function getReviewsByProduct(productId) {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.*, 
                u.nickname as user_name,
                u.profile_image as user_image
            FROM product_reviews r
            JOIN users u ON u.user_id = r.user_id
            WHERE r.product_id = ?
            ORDER BY r.creation_date DESC
        `, [productId]);
        return rows;
    } catch (error) {
        if (error.message.includes("doesn't exist")) return [];
        throw new Error(`getReviewsByProduct: error al obtener valoraciones – ${error.message}`);
    }
}

/**
 * CREA UNA NUEVA VALORACIÓN
 * @param {Object} reviewData - Datos (userId, productId, rating, comment)
 */
export async function createReview(reviewData) {
    try {
        // 1. Verificamos si ya existe una valoración para este producto en este pedido
        if (reviewData.orderId) {
            const [existing] = await db.query(`
                SELECT review_id FROM product_reviews 
                WHERE user_id = ? AND product_id = ? AND order_id = ?
            `, [reviewData.userId, reviewData.productId, reviewData.orderId]);

            if (existing.length > 0) {
                throw new Error("Ya has valorado este producto en este pedido.");
            }
        }

        const [result] = await db.query(`
            INSERT INTO product_reviews (user_id, product_id, order_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        `, [
            reviewData.userId,
            reviewData.productId,
            reviewData.orderId,
            reviewData.rating,
            reviewData.comment
        ]);
        return result.insertId;
    } catch (error) {
        throw new Error(`createReview: ${error.message}`);
    }
}

/**
 * OBTIENE TODAS LAS VALORACIONES (PARA EL ADMIN)
 */
export async function getAllReviews() {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.*, 
                u.nickname as user_name,
                p.name as product_name
            FROM product_reviews r
            JOIN users u ON u.user_id = r.user_id
            JOIN products p ON p.product_id = r.product_id
            ORDER BY r.creation_date DESC
        `);
        return rows;
    } catch (error) {
        if (error.message.includes("doesn't exist")) return [];
        return [];
    }
}

/**
 * ELIMINA UNA VALORACIÓN (ADMIN)
 */
export async function deleteReview(reviewId) {
    try {
        await db.query(`DELETE FROM product_reviews WHERE review_id = ?`, [reviewId]);
    } catch (error) {
        throw new Error(`deleteReview: error – ${error.message}`);
    }
}

/**
 * OBTIENE RESEÑAS ALEATORIAS PARA EL FRONTEND
 * @param {number} limit - Cantidad de reseñas
 */
export async function getRandomReviews(limit = 3) {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.comment as text, 
                u.nickname as author,
                r.rating
            FROM product_reviews r
            JOIN users u ON u.user_id = r.user_id
            WHERE r.comment IS NOT NULL AND r.comment != ''
            ORDER BY RAND()
            LIMIT ?
        `, [limit]);

        // Mapeamos para que coincida con lo que espera el componente (InfoSection)
        return rows.map(r => ({
            ...r,
            author: `${r.author.toUpperCase()}, Cliente Verificado`,
            rotation: Math.floor(Math.random() * 20) - 10, // Rotación aleatoria entre -10 y 10
            variant: "secondary"
        }));
    } catch (error) {
        console.error("getRandomReviews error:", error);
        return [];
    }
}
