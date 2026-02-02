// Archivo de ejemplo para entender como funciona la conexión, esto es hecho por IA comentado por mi

// Importamos la libreria mysql con la herramienta promise, necesaria para que js pueda usar await para que la web no se congele
// La web es mucho mas rapida que la base de datos, por lo que no podemos esperar sin hacer nada
import mysql from 'mysql2/promise';

console.log("Intentando conectar a DB con el usuario:", process.env.DB_USER);
// Creamos un "Pool" de conexiones. 
// El metodo pool permite tener las conexiones abiertas (Estado Idle: Son conexiones verificadas pero dormidas) para que sea mas rápido 
// y optimo, ya que no hay que contruir una nueva conexion cada vez que se consulta y ademas esto permite tener un limite de conexiones
export const db = mysql.createPool({
    // Coge los datos de .env.local
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,          // Si ya están en uso las 10 conexiones la ultima peticion se queda en cola sin lanzar error
    connectionLimit: 10,               // Este es el numero de conexiones abiertas y maximas, 10 es el optimo para que no pete
    queueLimit: 0,                     // Es el limite de peticiones en cola, 0 es infinito

    // Opcional: Esto ayuda a que las fechas de MySQL se lean correctamente en JS
    timezone: 'Z'
});

// Nota: Al usar 'export const db', ahora podemos importar esta conexión
// en cualquier API haciendo: import { db } from '@/lib/db';