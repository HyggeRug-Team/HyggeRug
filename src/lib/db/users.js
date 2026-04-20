/**
 * @file users.js
 * @description Capa de acceso a datos para la gestión de perfiles de usuario.
 * 
 * [Nuestro enfoque]
 * Centralizamos las consultas SQL relativas a la identidad del usuario para mantener 
 * la consistencia en todo el dashboard.
 * 
 * [Por qué lo hemos hecho así]
 * Separar el SQL del componente visual nos permite cambiar la estructura de la base de datos
 * sin romper la interfaz, además de facilitar la reutilización de datos de perfil en 
 * diferentes secciones (resumen, cuenta, sidebar).
 */

import { db } from '@/lib/db';

/**
 * OBTIENE LOS DATOS COMPLETOS DE UN USUARIO DESDE LA BBDD
 * @param {number|string} userId - ID único del usuario
 * @returns {Promise<Object|null>} Datos del usuario o null si no se encuentra
 */
export async function getUserById(userId) {
    try {
        const [rows] = await db.query(
            'SELECT user_id, nickname, email, profile_image, hygge_points, creation_date FROM users WHERE user_id = ?',
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`getUserById: error al obtener usuario ${userId} – ${error.message}`);
    }
}

/**
 * ACTUALIZA LOS DATOS DEL PERFIL
 * @param {number|string} userId - ID único del usuario
 * @param {Object} data - Objeto con los campos a actualizar (nickname, profile_image)
 * @returns {Promise<boolean>} True si se actualizó correctamente
 */
export async function updateProfile(userId, data) {
    try {
        const [result] = await db.query(
            'UPDATE users SET nickname = ?, profile_image = ? WHERE user_id = ?',
            [data.nickname, data.profile_image, userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`updateProfile: error al actualizar usuario ${userId} – ${error.message}`);
    }
}
