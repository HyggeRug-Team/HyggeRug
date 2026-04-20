/**
 * @file actions.js
 * @description Acciones de servidor (Server Actions) para la gestión del perfil y archivos.
 * 
 * [Nuestro enfoque]
 * Centralizamos las mutaciones de datos en este archivo para garantizar que cualquier 
 * cambio (ya sea texto o archivos) pase por validaciones de sesión en el lado del servidor.
 * 
 * [Por qué lo hemos hecho así]
 * Al usar Server Actions de Next.js, eliminamos la necesidad de crear APIs REST complejas 
 * para acciones simples, permitiendo una revalidación de cache instantánea con `revalidatePath`.
 * Para las imágenes, optamos por almacenamiento local en `public/uploads` por simplicidad y velocidad.
 */

'use server'

import { db } from '@/lib/db'; 
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * SUBE UNA IMAGEN LOCAL AL SERVIDOR Y ACTUALIZA LA BBDD
 * @param {FormData} formData - Datos del formulario con el archivo
 */
export async function uploadProfileImage(formData) {
    try {
        const file = formData.get('file');
        if (!file) return { success: false, error: "No se ha subido ningún archivo" };

        const session = await getSession();
        if (!session) return { success: false, error: "Sesión no válida" };

        const userId = session.userId || session.user_id || session.id;

        // Pasamos el archivo a bytes
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Definimos la ruta de guardado (public/uploads/avatars)
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
        
        // Nos aseguramos de que la carpeta existe
        await mkdir(uploadDir, { recursive: true });

        // Nombre de archivo único usando ID de usuario y timestamp
        const fileName = `user_${userId}_${Date.now()}_${file.name}`;
        const filePath = join(uploadDir, fileName);

        // Escribimos el archivo físicamente en el disco
        await writeFile(filePath, buffer);

        // La ruta web será relativa a public
        const publicUrl = `/uploads/avatars/${fileName}`;

        // Guardamos en BBDD
        const query = 'UPDATE users SET profile_image = ? WHERE user_id = ?';
        await db.query(query, [publicUrl, userId]);

        revalidatePath('/dashboard', 'layout');
        return { success: true, url: publicUrl };

    } catch (error) {
        console.error("[ACTION] Error subiendo imagen:", error);
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
        console.log(`[ACTION] Actualizando ${field} a "${value}"...`);
        const allowedFields = ['nickname', 'email', 'profile_image'];
        const session = await getSession();
        
        if (session && allowedFields.includes(field)) {
            // Buscamos el ID en el payload (en el login se guarda como userId)
            const userId = session.userId || session.user_id || session.id;
            console.log(`[ACTION] Usuario ID: ${userId}`);
            
            if (!userId) {
                console.error("[ACTION] No se pudo encontrar el ID de usuario en la sesión");
                return { success: false };
            }

            const query = `UPDATE users SET ${field} = ? WHERE user_id = ?`;
            const [result] = await db.query(query, [value, userId]);
            
            console.log("[ACTION] Resultado query:", result);

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