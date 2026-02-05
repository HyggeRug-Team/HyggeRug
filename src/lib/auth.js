// Archivo de ejemplo para entender como funciona la conexión, esto es hecho por IA comentado por mi
// JWT es una forma de verificar sesiones usando algo parecido a la criptografia asimetrica, es decir una clave en cliente y otra en servidor
import { SignJWT, jwtVerify } from 'jose'; // Importamos las herramientas para firmar y leer tokens
import { cookies } from 'next/headers';    // Importamos la herramienta de Next para manejar cookies

// 1. Preparamos tu "Sello Secreto"
// Convertimos la frase secreta de tu .env.local en un formato que la máquina pueda usar para sellar
// Guarda la clave de env.local en binario (TextEncoder() es el constructor y encode la función) Estuve 15 minutos intentando entender eso
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * FUNCIÓN PARA CREAR EL PASAPORTE (TOKEN)
 * Se usa cuando el usuario pone bien su contraseña en el Login.
 */
// async es necesario para usar await para mantener la función en pausa si la base de datos está espera
export async function createSession(payload) {
  // 'payload' son los datos que queremos guardar dentro, debe ser un json ej:({ "id": 5, "nombre": "Pepe", "email": "admin@hygge.com" })
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })  // Elegimos el algoritmo de seguridad, este es el estandar para seguridad y velocidad
    .setIssuedAt()                         // Anotamos cuándo se creó el carnet, para identificar el tiempo que tiene
    .setExpirationTime('7d')               // Decimos que el carnet caduca en una semana
    .sign(SECRET_KEY);                     // Lo cerramos herméticamente con tu llave secreta del servidor
}

/**
 * FUNCIÓN PARA VERIFICAR EL PASAPORTE
 * Se usa en el Middleware para saber si dejamos pasar a alguien.
 */
export async function verifySession(token) {
  try {
    // Intentamos abrir el carnet usando tu llave secreta
    const { payload } = await jwtVerify(token, SECRET_KEY);
    
    // Si la llave encaja y no ha caducado, devolvemos los datos que hay dentro
    return payload; 
  } catch (error) {
    // Si alguien intentó falsificar el carnet o ya caducó, devolvemos "null" (nada)
    return null;
  }
}