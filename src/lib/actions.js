/**
 * @file actions.js
 * @description Orquestador de lógica del lado del servidor (Server Actions).
 * 
 * [Nuestro enfoque]
 * Aquí centralizamos todas las operaciones que necesitan "tocar" la base de datos o 
 * servicios externos (como el correo). Al usar Server Actions, mantenemos la lógica 
 * sensible fuera del navegador del cliente, haciendo que todo sea más seguro y rápido.
 * 
 * [Por qué lo hemos hecho así]
 * Separar las acciones de los componentes visuales nos permite reutilizar funciones 
 * (como obtener pedidos o crear tickets) en cualquier parte de la web sin repetir código. 
 * Además, nos facilita el manejo de errores de forma centralizada y clara.
 */

'use server'

import { db } from '@/lib/db'; 
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';
import { put } from '@vercel/blob';
import { createTicket } from './db/support';
import { createReturn } from './db/returns';
import { createReview } from './db/reviews';

/* ─── Soporte y Atención al Cliente ─── */
/**
 * Crea un ticket de soporte. Lo usamos para que el usuario pueda enviar dudas 
 * o solicitar devoluciones sin complicaciones.
 */
export async function createSupportTicket(ticketData) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;

        // Aseguramos que los campos tengan valores válidos para la BBDD
        const finalTicketData = {
            userId,
            orderId: ticketData.orderId || null,
            type: ticketData.type || 'soporte',
            reason: ticketData.reason || ticketData.subject || 'Consulta sobre pedido',
            description: ticketData.description || 'Consulta enviada desde el portal del cliente'
        };

        const ticketId = await createTicket(finalTicketData);

        revalidatePath('/dashboard/ayuda', 'layout');
        return { success: true, ticketId };

    } catch (error) {
        console.error("[ACTION] Error crítico creando ticket:", error);
        return { success: false, error: error.message };
    }
}

/**
 * SOLICITA UNA DEVOLUCIÓN DE UN PEDIDO
 */
export async function requestReturnAction(returnData) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;

        const returnId = await createReturn({
            ...returnData,
            userId
        });

        revalidatePath('/dashboard/devoluciones', 'layout');
        return { success: true, returnId };

    } catch (error) {
        console.error("[ACTION] Error solicitando devolución:", error);
        return { success: false, error: error.message };
    }
}

/**
 * CREA UNA RESEÑA DE UN PRODUCTO
 */
export async function createReviewAction(reviewData) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;

        const reviewId = await createReview({
            ...reviewData,
            userId
        });

        return { success: true, reviewId };
    } catch (error) {
        console.error("[ACTION] Error creando reseña:", error);
        return { success: false, error: error.message };
    }
}


/**
 * OBTIENE LOS PEDIDOS DEL USUARIO
 */
export async function getUserOrdersAction() {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;
        
        const { getOrdersByUser } = await import('./db/orders');
        const orders = await getOrdersByUser(userId);

        return { success: true, orders };
    } catch (error) {
        console.error("[ACTION] Error obteniendo pedidos:", error);
        return { success: false, error: "No se pudieron cargar los pedidos." };
    }
}


/**
 * SUBE UNA IMAGEN A VERCEL BLOB Y ACTUALIZA LA BBDD
 * @param {FormData} formData - Datos del formulario con el archivo
 */
export async function uploadProfileImage(formData) {
    try {
        const file = formData.get('file');
        if (!file) return { success: false, error: "No se ha subido ningún archivo" };

        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;

        // --- Catch de tamaño (2MB) ---
        // Validamos el peso del archivo antes de subirlo a la nube.
        const MAX_SIZE = 2 * 1024 * 1024; // 2 Megabytes
        if (file.size > MAX_SIZE) {
            return { 
                success: false, 
                error: "La imagen es demasiado pesada. El límite para fotos de perfil es de 2MB para mantener la web rápida." 
            };
        }

        // Nombre de archivo único usando ID de usuario y timestamp
        const fileName = `avatars/user_${userId}_${Date.now()}_${file.name}`;

        // Subimos directamente el archivo a Vercel Blob
        const blob = await put(fileName, file, {
            access: 'public',
        });

        const publicUrl = blob.url;

        // Guardamos en BBDD
        const query = 'UPDATE users SET profile_image = ? WHERE user_id = ?';
        await db.query(query, [publicUrl, userId]);

        revalidatePath('/dashboard', 'layout');
        return { success: true, url: publicUrl };

    } catch (error) {
        console.error("[ACTION] Error subiendo imagen a Vercel Blob:", error);
        return { success: false, error: error.message };
    }
}

/**
 * OBTIENE EL ÚLTIMO PEDIDO DEL USUARIO CON DETALLES
 */
export async function getLatestOrderAction() {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;

        // Buscamos el último pedido real
        const [rows] = await db.query(`
            SELECT 
                o.order_id, o.order_status as status, o.total_amount, o.creation_date,
                p.name as product_name, p.image_url
            FROM orders o
            LEFT JOIN order_product oi ON oi.order_id = o.order_id
            LEFT JOIN products p ON p.product_id = oi.product_id
            WHERE o.user_id = ? AND o.order_status != 'en_carrito'
            ORDER BY o.creation_date DESC
            LIMIT 1
        `, [userId]);

        if (rows.length === 0) return { success: true, order: null };

        return { 
            success: true, 
            order: {
                order_id: rows[0].order_id,
                status: rows[0].status,
                total: rows[0].total_amount,
                date: rows[0].creation_date,
                product: rows[0].product_name,
                image: rows[0].image_url
            } 
        };
    } catch (error) {
        console.error("[ACTION] Error en getLatestOrderAction:", error);
        return { success: false, error: error.message };
    }
}

/**
 * ACTUALIZA DATOS DEL USUARIO EN LA BBDD
 */
export async function updateUserData(field, value) {
    try {
        const allowedFields = ['nickname', 'email', 'profile_image'];
        const session = await getSession();

        if (session && allowedFields.includes(field)) {
            const userId = session.userId || session.user_id || session.id;
            const query = `UPDATE users SET ${field} = ? WHERE user_id = ?`;
            await db.query(query, [value, userId]);
            revalidatePath('/dashboard', 'layout');
            return { success: true };
        }
        return { success: false };
    } catch (error) {
        return { success: false };
    }
}

/**
 * SUBE UN ACTIVO DE TIENDA (VIDEO, BANNER) A VERCEL BLOB
 * Exclusivo para administradores.
 */
export async function uploadStoreAsset(formData) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return { success: false, error: "No autorizado" };
        }

        const file = formData.get('file');
        const folder = formData.get('folder') || 'assets';
        if (!file) return { success: false, error: "No se ha subido ningún archivo" };

        // Límite más alto para videos (20MB)
        const MAX_SIZE = 20 * 1024 * 1024; 
        if (file.size > MAX_SIZE) {
            return { 
                success: false, 
                error: "El archivo es demasiado pesado (Max 20MB)." 
            };
        }

        const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

        const blob = await put(fileName, file, {
            access: 'public',
        });

        return { success: true, url: blob.url };
    } catch (error) {
        console.error("[ACTION] Error subiendo activo:", error);
        return { success: false, error: error.message };
    }
}