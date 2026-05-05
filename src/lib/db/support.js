import { db } from '@/lib/db';

/**
 * CREAR UN NUEVO TICKET DE SOPORTE / DEVOLUCIÓN
 */
export async function createTicket(ticketData) {
    try {
        const [result] = await db.query(`
            INSERT INTO support_tickets 
                (user_id, order_id, type, reason, description, status)
            VALUES (?, ?, ?, ?, ?, 'abierto')
        `, [
            ticketData.userId,
            ticketData.orderId || null,
            ticketData.type,
            ticketData.reason,
            ticketData.description
        ]);
        return result.insertId;
    } catch (error) {
        console.error("Error en createTicket:", error);
        throw new Error("No se pudo crear el ticket de soporte.");
    }
}

/**
 * OBTENER TICKETS DE UN USUARIO
 */
export async function getTicketsByUser(userId) {
    try {
        const [rows] = await db.query(`
            SELECT t.*, o.order_status as related_order_status
            FROM support_tickets t
            LEFT JOIN orders o ON o.order_id = t.order_id
            WHERE t.user_id = ?
            ORDER BY t.creation_date DESC
        `, [userId]);
        return rows;
    } catch (error) {
        console.error("Error en getTicketsByUser:", error);
        throw new Error("No se pudieron obtener los tickets.");
    }
}

/**
 * OBTENER TICKET POR ID
 */
export async function getTicketById(ticketId) {
    try {
        const [rows] = await db.query(`
            SELECT t.*, u.nickname, u.email, o.total_amount
            FROM support_tickets t
            JOIN users u ON u.user_id = t.user_id
            LEFT JOIN orders o ON o.order_id = t.order_id
            WHERE t.ticket_id = ?
        `, [ticketId]);
        return rows[0];
    } catch (error) {
        console.error("Error en getTicketById:", error);
        throw new Error("No se pudo obtener el ticket.");
    }
}
