/**
 * @file returns.js
 * @description Gestión de solicitudes de devolución y estado de retornos.
 * 
 * [Nuestro enfoque]
 * Manejamos las devoluciones vinculándolas siempre a un pedido existente para 
 * mantener la integridad de la trazabilidad.
 * 
 * [Por qué lo hemos hecho así]
 * Separar las devoluciones de los pedidos generales permite un seguimiento más limpio 
 * del estado de post-venta sin saturar la tabla principal de órdenes.
 */

import { db } from '@/lib/db';

/**
 * OBTIENE LAS DEVOLUCIONES DE UN USUARIO
 * @param {number|string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de devoluciones registradas
 */
export async function getReturnsByUser(userId) {
    try {
        // Hacemos un join con orders para saber qué se está devolviendo y su valor original
        const [rows] = await db.query(`
            SELECT 
                r.*, 
                o.total_amount as order_total
            FROM order_returns r
            JOIN orders o ON o.order_id = r.order_id
            WHERE r.user_id = ?
            ORDER BY r.creation_date DESC
        `, [userId]);
        return rows;
    } catch (error) {
        // Manejo amigable: si la tabla no existe aún, devolvemos array vacío en lugar de romper la app
        if (error.message.includes("doesn't exist")) return [];
        throw new Error(`getReturnsByUser: error al obtener devoluciones del usuario ${userId} – ${error.message}`);
    }
}

/**
 * CREA UNA NUEVA SOLICITUD DE DEVOLUCIÓN
 * @param {Object} returnData - Datos de la devolución (userId, orderId, reason)
 * @returns {Promise<number>} ID de la devolución creada
 */
export async function createReturn(returnData) {
    try {
        const [result] = await db.query(`
            INSERT INTO order_returns (user_id, order_id, reason, status)
            VALUES (?, ?, ?, 'pendiente')
        `, [
            returnData.userId,
            returnData.orderId,
            returnData.reason
        ]);
        return result.insertId;
    } catch (error) {
        throw new Error(`createReturn: error al crear devolución – ${error.message}`);
    }
}
