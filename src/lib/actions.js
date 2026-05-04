/**
 * @file actions.js
 * @description Acciones de servidor (Server Actions) para la gestión del perfil y archivos.
 * 
 * [Nuestro enfoque]
 * Centralizamos las mutaciones de datos en este archivo para garantizar que cualquier 
 * cambio pase por validaciones de sesión en el lado del servidor. Para la gestión 
 * de archivos, hemos migrado a un modelo de almacenamiento en la nube (Vercel Blob).
 * 
 * [Por qué lo hemos hecho así]
 * Las arquitecturas Serverless (como Vercel) no garantizan la persistencia de archivos 
 * escritos en disco local. Al usar Vercel Blob, aseguramos que las fotos de perfil 
 * sean permanentes, escalables y accesibles globalmente sin depender del servidor físico.
 */

'use server'

import { db } from '@/lib/db'; 
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';
import { put } from '@vercel/blob';
import { createTicket } from './db/support';

/**
 * CREA UN TICKET DE SOPORTE (AYUDA / DEVOLUCIONES)
 */
export async function createSupportTicket(ticketData) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;

        const ticketId = await createTicket({
            ...ticketData,
            userId
        });

        revalidatePath('/dashboard/ayuda', 'layout');
        return { success: true, ticketId };

    } catch (error) {
        console.error("[ACTION] Error creando ticket:", error);
        return { success: false, error: error.message };
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
 * ACTUALIZA DATOS DEL USUARIO EN LA BBDD
 * @param {string} field - El campo a modificar (nickname, email, etc.)
 * @param {any} value - El nuevo valor
 */
export async function updateUserData(field, value) {
    try {
        const allowedFields = ['nickname', 'email', 'profile_image'];
        const session = await getSession();

        if (session && allowedFields.includes(field)) {
            const userId = session.userId || session.user_id || session.id;

            if (!userId) {
                console.error("[ACTION] No se pudo encontrar el ID de usuario en la sesión");
                return { success: false };
            }

            const query = `UPDATE users SET ${field} = ? WHERE user_id = ?`;
            await db.query(query, [value, userId]);

            // Forzamos revalidación de todas las páginas del dashboard
            revalidatePath('/dashboard', 'layout');

            return { success: true };
        } else {
            console.error("[ACTION] Campo no permitido o sesión no válida:", field);
            return { success: false };
        }
    } catch (error) {
        console.error("[ACTION] Error en updateUserData:", error);
        return { success: false };
    }
}