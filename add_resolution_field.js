import mysql from 'mysql2/promise';

async function addResolutionField() {
    const dbConfig = {
        host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
        user: '3MddiPyLb3Sbj4b.root',
        password: 'N4lK09TZmfhZe5pV',
        database: 'hyggeDB',
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    };

    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log("Añadiendo columna 'resolution_message' a support_tickets...");
        
        await connection.query(`
            ALTER TABLE support_tickets 
            ADD COLUMN resolution_message TEXT AFTER description
        `);

        console.log("¡Columna añadida correctamente!");
    } catch (err) {
        console.error("Error añadiendo columna:", err);
    } finally {
        await connection.end();
        process.exit();
    }
}

addResolutionField();
