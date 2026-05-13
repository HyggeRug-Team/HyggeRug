/**
 * @file config.js
 * @description Helpers de acceso a la tabla de configuración maestra.
 * 
 * [Nuestro enfoque]
 * Hemos centralizado aquí la lógica de lectura de la base de datos para todas 
 * las variables de entorno dinámicas. Nuestra prioridad es minimizar la carga 
 * en el servidor, por lo que hemos optimizado las consultas para que puedan 
 * recuperar múltiples claves en una sola transacción.
 */
import { db } from "@/lib/db";

/**
 * RECUPERA UN VALOR ESPECÍFICO
 * Lo usamos para consultas puntuales de una sola variable.
 */
export async function getConfigValue(key) {
  const [rows] = await db.query(
    "SELECT config_value FROM config WHERE config_key = ?",
    [key]
  );
  return rows[0]?.config_value ?? null;
}

/**
 * RECUPERA UN DICCIONARIO DE VALORES
 * Este es nuestro método preferido para inyectar datos en componentes grandes 
 * (como el Footer o el Header), ya que reduce la latencia al agrupar peticiones.
 */
export async function getConfigValues(keys) {
  const placeholders = keys.map(() => "?").join(", ");
  const [rows] = await db.query(
    `SELECT config_key, config_value FROM config WHERE config_key IN (${placeholders})`,
    keys
  );
  // Transformamos el resultado en un objeto plano { key: value } para mayor comodidad
  return Object.fromEntries(rows.map((r) => [r.config_key, r.config_value]));
}