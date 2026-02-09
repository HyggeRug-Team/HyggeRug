import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // SSL solo si no estamos en localhost (para producción)
    ...(process.env.DB_HOST !== 'localhost' && {
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    }),
    timezone: 'Z'
}); 