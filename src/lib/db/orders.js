// Archivo para gestionar y realizar acciones con los Pedidos en la Base de Datos
// Este módulo abstrae la lógica SQL para que el resto de tu app no tenga que escribir las consultas
import { db } from '@/lib/db';
import { incrementDiscountUses } from './discounts';

/**
 * FUNCIÓN PARA CREAR UN PEDIDO COMPLETO
 * Funciona como una "Transacción Atómica", lo que significa que o se guarda TODO bien (pedido + lineas)
 * o si falla a la mitad, se cancela todo para no dejar datos rotos.
 * @param {Object} orderData - Toda la información del pedido (usuario, direccion, etc)
 */
export async function createOrder(orderData) {
    // 1. Pedimos un "carril" (conexión) exclusivo a la base de datos
    const conn = await db.getConnection();
    try {
        // Inicializamos la transacción. A partir de aquí todo se hace en memoria temporal hasta el commit
        await conn.beginTransaction();

        // 2. Insertar los datos generales de la cabecera del pedido
        // Se ha ajustado para quitar el envío (shipping) según los últimos cambios de esquema
        const [orderResult] = await conn.query(`
            INSERT INTO orders
                (user_id, address_id, discount_code_id, discount_amount, total_amount, payment_id, payment_method, order_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'diseñando')
        `, [
            orderData.userId,
            orderData.addressId,
            orderData.discountCodeId ?? null,
            orderData.discountAmount ?? 0,
            orderData.totalAmount,           // Total a cobrar al cliente
            orderData.paymentId ?? null,     // Id de la plataforma de pago (Stripe)
            orderData.paymentMethod ?? null, // Ejemplo: 'tarjeta' o 'paypal'
        ]);

        // Guardamos el ID que la base de datos le ha dado automáticamente (AI) a este pedido
        const orderId = orderResult.insertId;

        // 3. Insertar todas las alfombras (items) asociadas al carrito/pedido
        for (const item of orderData.items) {
            await conn.query(`
                INSERT INTO orders_items
                    (order_id, size_id, product_size, custom_note, price, quantity, user_image, final_design)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                orderId,
                item.sizeId ?? null,
                item.productSize ?? null, // Ej: "Teclado TKL" o "60x90", por si el size original es borrado después
                item.customNote ?? null,  // Para medidas a ojo, texto libre o detalles especiales
                item.price,               // Precio unitario
                item.quantity ?? 1,
                item.userImage ?? null,   // URL de la imagen que subió el cliente
                item.finalDesign ?? null, // URL del diseño final vectorizado
            ]);
        }

        // 4. Si ha usado un cupón de descuento válido, sumamos "+1" a su contador para evitar abusos
        if (orderData.discountCodeId) {
            await incrementDiscountUses(conn, orderData.discountCodeId);
        }

        // 5. ¡Todo ha ido perfecto! Validamos y cerramos la transacción (COMMIT)
        await conn.commit();
        return orderId;
    } catch (error) {
        // En caso de fallar en el paso 2, 3 o 4, hacemos un "Ctrl+Z" de la BBDD (ROLLBACK) y avisamos del error
        await conn.rollback();
        throw new Error(`createOrder: error al crear el pedido – ${error.message}`);
    } finally {
        // Siempre, falle o no, desconectamos el "carril" de la base de datos para no saturarla
        conn.release();
    }
}

/**
 * FUNCIÓN PARA OBTENER LOS PEDIDOS DE UN USUARIO (CON SUS ALFOMBRAS INCLUIDAS)
 * Usa LEFT JOIN para traer toda la info en una misma tabla gigante y luego agrupa filas duplicadas.
 */
export async function getOrdersByUser(userId) {
    try {
        const [rows] = await db.query(`
            SELECT
                o.order_id,
                o.order_status,
                o.total_amount,
                o.discount_amount,
                o.payment_method,
                o.creation_date,
                o.updated_date,
                oi.item_id,
                oi.product_size,
                oi.custom_note,
                oi.price          AS item_price,
                oi.quantity,
                oi.user_image,
                oi.final_design,
                s.dimensions      AS size_label
            FROM orders o
            LEFT JOIN orders_items   oi ON oi.order_id = o.order_id
            LEFT JOIN sizes          s  ON s.size_id   = oi.size_id
            WHERE o.user_id = ?
            ORDER BY o.creation_date DESC
        `, [userId]);

        // Al usar joins, cada order sale varias veces si tiene muchos items. La agrupamos:
        return groupOrderRows(rows);
    } catch (error) {
        throw new Error(`getOrdersByUser: error al obtener pedidos del usuario ${userId} – ${error.message}`);
    }
}

/**
 * FUNCIÓN PARA TRAER TODOS LOS DETALLES SOBRE UN ÚNICO PEDIDO EN CONCRETO (DIRECCION INCLUIDA)
 */
export async function getOrderById(orderId) {
    try {
        const [rows] = await db.query(`
            SELECT
                o.*,
                ua.calle, ua.portal_piso_puerta, ua.ciudad,
                ua.provincia, ua.codigo_postal, ua.pais, ua.phone_number,
                dc.code           AS discount_code,
                oi.item_id,
                oi.product_size,
                oi.custom_note,
                oi.price          AS item_price,
                oi.quantity,
                oi.user_image,
                oi.final_design,
                s.dimensions      AS size_label
            FROM orders o
            LEFT JOIN userAddresses   ua ON ua.address_id = o.address_id
            LEFT JOIN discount_codes  dc ON dc.code_id   = o.discount_code_id
            LEFT JOIN orders_items    oi ON oi.order_id  = o.order_id
            LEFT JOIN sizes           s  ON s.size_id    = oi.size_id
            WHERE o.order_id = ?
        `, [orderId]);

        if (!rows.length) return null; // Si no lo encuentra devuelve algo nulo
        // Retornamos el primer bloque tras el parseo (ya que group trae un array de un pedido)
        return groupOrderRows(rows)[0];
    } catch (error) {
        throw new Error(`getOrderById: error al obtener el pedido ${orderId} – ${error.message}`);
    }
}

/**
 * FUNCIÓN QUE CAMBIA EL ESTADO DE UN PEDIDO (diseñando, tejido, enviado...)
 */
export async function updateOrderStatus(orderId, status) {
    // Array para evitar que se pasen estados falsos por seguridad (protección extra)
    const VALID_STATUSES = [
        'diseñando',
        'pendiente de aprobación',
        'comprobando pago',
        'tejiendo',
        'enviado',
        'recibido',
    ];
    if (!VALID_STATUSES.includes(status)) {
        throw new Error(`updateOrderStatus: estado "${status}" no válido`);
    }
    
    try {
        await db.query(`UPDATE orders SET order_status = ? WHERE order_id = ?`, [status, orderId]);
    } catch (error) {
        throw new Error(`updateOrderStatus: error al actualizar el pedido ${orderId} – ${error.message}`);
    }
}

// ==============================================================================
// FUNCIONES PRIVADAS (Helpers - "Cajas de herramientas" que no son exportables)
// ==============================================================================

/**
 * AGRUPADOR INTERNO DE MÚLTIPLES FILAS
 * Esta función es obligatoria cuando usamos JOINs en Base de Datos de 1 a N.
 * Sirve para anidar "Sub-Items" (alfombras) dentro de "Pedidos Madre", creando un JSON limpio para NextJS
 */
function groupOrderRows(rows) {
    const ordersMap = new Map();

    for (const row of rows) {
        // Solo instanciamos el pedido principal la primera vez que lo vemos
        if (!ordersMap.has(row.order_id)) {
            ordersMap.set(row.order_id, {
                order_id:          row.order_id,
                order_status:      row.order_status,
                total_amount:      row.total_amount,
                discount_amount:   row.discount_amount,
                discount_code:     row.discount_code ?? null,
                payment_method:    row.payment_method,
                creation_date:     row.creation_date,
                updated_date:      row.updated_date,
                address: row.calle ? {
                    calle:              row.calle,
                    portal_piso_puerta: row.portal_piso_puerta,
                    ciudad:             row.ciudad,
                    provincia:          row.provincia,
                    codigo_postal:      row.codigo_postal,
                    pais:               row.pais,
                    phone_number:       row.phone_number,
                } : null,
                items: [], // Inicialmente sin items
            });
        }

        // Cada vez que lo vemos de nuevo o si es la 1°, apilamos el sub-item correspondiente (la alfombra comprada)
        if (row.item_id) {
            ordersMap.get(row.order_id).items.push({
                item_id:      row.item_id,
                product_size: row.size_label ?? row.product_size, // Da prioridad en caso de cambios de nombre histórico
                custom_note:  row.custom_note,
                price:        row.item_price,
                quantity:     row.quantity,
                user_image:   row.user_image,
                final_design: row.final_design,
            });
        }
    }

    return Array.from(ordersMap.values());
}
