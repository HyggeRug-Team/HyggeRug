// lib/db/config.js
// Archivo usado para recoger todas las configuraciones de la tabla config
import { db } from "@/lib/db"; // ajusta el import a tu cliente PDO/mysql2/etc

// Obtiene un valor de config por su clave
export async function getConfigValue(key) {
  const [rows] = await db.query(
    "SELECT config_value FROM config WHERE config_key = ?",
    [key]
  );
  return rows[0]?.config_value ?? null;
}

// Obtiene varios valores de una vez para evitar múltiples queries
export async function getConfigValues(keys) {
  const placeholders = keys.map(() => "?").join(", ");
  const [rows] = await db.query(
    `SELECT config_key, config_value FROM config WHERE config_key IN (${placeholders})`,
    keys
  );
  // Devuelve un objeto { clave: valor } para acceso fácil
  return Object.fromEntries(rows.map((r) => [r.config_key, r.config_value]));
}