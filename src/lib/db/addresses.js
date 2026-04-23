// Controlador que engloba la lógica para manejar todas las direcciones postales del cliente.
import { db } from '@/lib/db';

/**
 * FUNCIÓN PARA OBTENER TODAS LAS DIRECCIONES DE UN CLIENTE
 * @param {number} userId - ID numérico de tu usuario.
 * @returns {Promise<Array>} Listado con todas las calles/cp que ha guardado.
 */
export async function getAddressesByUser(userId) {
    try {
        // Ordenamos dándole prioridad a "is_default" para que salga arriba en tu checkout
        const [rows] = await db.query(`
            SELECT
                address_id,
                user_id,
                calle,
                portal_piso_puerta,
                ciudad,
                provincia,
                codigo_postal,
                pais,
                phone_number,
                is_default
            FROM userAddresses
            WHERE user_id = ?
            ORDER BY is_default DESC, address_id ASC
        `, [userId]);
        return rows;
    } catch (error) {
        throw new Error(`getAddressesByUser: error al obtener direcciones del usuario ${userId} – ${error.message}`);
    }
}

/**
 * FUNCIÓN ATAJO PARA SACAR DIRECTAMENTE LA DIRECCIÓN ESTÁNDAR
 * Así rellenarás el formulario del Checkout sin que el usuario tenga que hacer click en nada extra.
 */
export async function getDefaultAddress(userId) {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM userAddresses
            WHERE user_id = ?
            ORDER BY is_default DESC, address_id ASC
            LIMIT 1
        `, [userId]);
        
        return rows[0] ?? null; // Devuelve solo un "json", si no hay devuelve null para detectar si es un cliente nuevo
    } catch (error) {
        throw new Error(`getDefaultAddress: error al obtener dirección por defecto del usuario ${userId} – ${error.message}`);
    }
}

/**
 * CREA UNA DIRECCIÓN Y REGULA AUTOMÁTICAMENTE CUÁL ES 'DEFAULT' (Predeterminada)
 * Ejecuta dos sentencias a la vez de forma atómica para evitar romper la lógica.
 */
export async function createAddress(userId, addressData) {
    // Al igual que en Pedidos, guardamos todo a la vez! Pidiendo conexión única.
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Si el usuario ha tildado "usar como predeterminada", limpiamos (update=false) las antiguas.
        // Así nos garantizamos de que nunca tendrá dos "Default Address".
        if (addressData.is_default) {
            await conn.query(
                `UPDATE userAddresses SET is_default = FALSE WHERE user_id = ?`,
                [userId]
            );
        }

        // 2. Registramos su nueva dirección ya en limpio
        const [result] = await conn.query(`
            INSERT INTO userAddresses
                (user_id, calle, portal_piso_puerta, ciudad, provincia,
                 codigo_postal, pais, phone_number, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            addressData.calle,
            addressData.portal_piso_puerta ?? null,
            addressData.ciudad,
            addressData.provincia,
            addressData.codigo_postal,
            addressData.pais ?? 'España',
            addressData.phone_number,
            addressData.is_default ?? false,
        ]);

        await conn.commit();
        return result.insertId;
    } catch (error) {
        await conn.rollback();
        throw new Error(`createAddress: error al crear dirección – ${error.message}`);
    } finally {
        conn.release(); // Libera la pool! Cuidado con quitar esto.
    }
}

/**
 * FUNCIÓN DEBORRADOR SIMPLE PARA TU PERFIL DE USUARIO.
 */
export async function deleteAddress(userId, addressId) {
    try {
        // Obliga a que la ID de la calle pertenezca a este user_id, así ningún hacker puede
        // pasar por url un addressId que sea de tu administrador o de otra persona.
        const [result] = await db.query(
            `DELETE FROM userAddresses WHERE address_id = ? AND user_id = ?`,
            [addressId, userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`deleteAddress: error al eliminar dirección ${addressId} – ${error.message}`);
    }
}

/**
 * MARCA UNA DIRECCIÓN COMO PREDETERMINADA
 * Resetea todas las del usuario primero para garantizar que solo hay una activa.
 */
export async function setDefaultAddress(userId, addressId) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Quitamos el flag a todas las direcciones del usuario
        await conn.query(
            `UPDATE userAddresses SET is_default = FALSE WHERE user_id = ?`,
            [userId]
        );

        // 2. Activamos solo la seleccionada, verificando que pertenece al usuario (evita IDOR)
        const [result] = await conn.query(
            `UPDATE userAddresses SET is_default = TRUE WHERE address_id = ? AND user_id = ?`,
            [addressId, userId]
        );

        await conn.commit();

        // Si affectedRows es 0 la dirección no existe o no pertenece al usuario
        return result.affectedRows > 0;
    } catch (error) {
        await conn.rollback();
        throw new Error(`setDefaultAddress: error al actualizar dirección ${addressId} – ${error.message}`);
    } finally {
        conn.release();
    }
}