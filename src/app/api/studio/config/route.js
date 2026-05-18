// ENDPOINT DE CONFIGURACIÓN DEL LABORATORIO — Devuelve los ajustes del estudio de diseño (límites, mensajes, etc.).
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await db.query(
            `SELECT config_key, config_value FROM config 
             WHERE config_key IN ('price_per_cm2', 'max_rug_width', 'max_rug_height')`
        );

        // Convertir array de filas a objeto clave-valor
        const config = rows.reduce((acc, row) => {
            acc[row.config_key] = parseFloat(row.config_value);
            return acc;
        }, {});

        return NextResponse.json({
            pricePerCm2: config.price_per_cm2 ?? 0.0333,
            maxWidth:    config.max_rug_width  ?? 140,
            maxHeight:   config.max_rug_height ?? 140,
        });
    } catch (error) {
        console.error('[studio/config]', error);
        // Valores por defecto si falla la BD
        return NextResponse.json({
            pricePerCm2: 0.0333,
            maxWidth:    140,
            maxHeight:   140,
        });
    }
}