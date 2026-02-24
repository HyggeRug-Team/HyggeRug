// Este archivo facilita la modificación de los campos en la base de datos
// Se puede usar en componentes directamente importando la función que se quiera y usandola asi te evitas usar api
// Intenta que si creas alguna función si se puede hacer generica mejor
'use server'
import { conn } from '@/lib/db'; 
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
// Maneja la cache, es necesario para cuando los datos se actualicen sean visibles
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';

// Solo modifica la tabla users, field es el campo en la bd y value el valor nuevo
export async function updateUserData(field, value) {
    try {
        // Este array contiene los cambios que se pueden cambiar, si añadimos mas solo hay que ponerlos aqui y usar el componente de la misma forma
        const allowedFields = ['name', 'email'];
        const cookie = await getSession();
        // Si la cookie existe y el campo a modificar está dentro de los campos permitidos
        if(cookie && allowedFields.includes(field)){
            // 2. Base de datos: Ejecutamos el cambio
            // Usamos [value, payload.id] para evitar inyecciones SQL
            const query = `UPDATE users SET ${field} = ? WHERE id = ?`;
            await conn.execute(query, [value, cookie.id]);

            //Actualiza la cache de dashboard
            revalidatePath('/dashboard'); 
            
            return { success: true };
        }else{
            return { success: false};
        }
        
    } catch (error) {
        console.error("Error en DB:", error);
        return { success: false };
    }
}