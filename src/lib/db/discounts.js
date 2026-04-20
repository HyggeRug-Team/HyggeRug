// Sistema para aplicar Códigos de Descuento
// Este archivo protege de estafas en el checkout evaluando minuciosamente fechas de promoción
import { db } from '@/lib/db';

/**
 * VALIDADOR DEL CÓDIGO
 * Comprueba que no hayan expirado fechas y las limitaciones numéricas (cantidad de stock/dinero gastado).
 * ATENCIÓN: No disminuye "uses_count" aquí. Solamente avisa y valida al Frontend.
 *
 * @param {string} code         - Código escrito en el input por el usuario.
 * @param {number} orderAmount  - Total del pedido (sin descuento).
 * @returns {Promise<Object|null>} - Retornará JSON el descuento si es válido, o "null" si le mentimos.
 */
export async function validateDiscountCode(code, orderAmount) {
    try {
        // En SQL: usamos AND en cascada para evaluar un montón de condiciones súper rápido
        const [rows] = await db.query(`
            SELECT *
            FROM discount_codes
            WHERE code = ?
              AND is_active = TRUE
              -- Esta línea limita el máximo número de usos global con la BBDD.
              AND (max_uses IS NULL OR uses_count < max_uses)
              -- Validación de fechas de caducidad
              AND (valid_from  IS NULL OR valid_from  <= NOW())
              AND (valid_until IS NULL OR valid_until >= NOW())
              -- Exige un limite barato de compras 
              AND min_order_amount <= ?
        `, [code, orderAmount]);

        return rows[0] ?? null; // Devuelve solo el cupón en objeto
    } catch (error) {
        throw new Error(`validateDiscountCode: error al validar el código "${code}" – ${error.message}`);
    }
}

/**
 * ACTUALIZADORA DE CUPÓN (CONSUMIR CUPÓN)
 * Se llama **AUTOMÁTICAMENTE** dentro de la función de Orders (en src/lib/db/orders.js ) 
 * cuando ya se le cobró el dinero de verdad.
 *
 * @param {Object} conn     - Variable conectada al "carril" de transacción del pedido
 * @param {number} codeId   - identificador del cupón usado
 */
export async function incrementDiscountUses(conn, codeId) {
    // Aumentamos los usos de forma automatica
    await conn.query(
        `UPDATE discount_codes SET uses_count = uses_count + 1 WHERE code_id = ?`,
        [codeId]
    );
}
