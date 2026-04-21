// Gestión de créditos semanales de IA por usuario
// Archivo para recoger los usos de creditos esta semana y comprueba si se ha completado una semana para reiniciarlos
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const user = await getSession();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const weeklyLimit = parseInt(process.env.AI_WEEKLY_LIMIT) || 5;
        const now = new Date();

        // Obtenemos los datos de créditos del usuario
        const [rows] = await db.query(
            'SELECT ai_credits_used, ai_credits_reset_at FROM users WHERE user_id = ?',
            [user.userId]
        );
        const userData = rows[0];

        // Comprobamos si la fecha de reset existe y si ha pasado una semana
        const resetAt = userData.ai_credits_reset_at ? new Date(userData.ai_credits_reset_at) : null;
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        const shouldReset = !resetAt || (now - resetAt) >= oneWeekMs;

        if (shouldReset) {
            await db.query(
                'UPDATE users SET ai_credits_used = 0, ai_credits_reset_at = ? WHERE user_id = ?',
                [now, user.userId]
            );
            // Calculamos cuándo será el próximo reset (una semana desde ahora)
            const nextReset = new Date(now.getTime() + oneWeekMs);
            return NextResponse.json({ remaining: weeklyLimit, weeklyLimit, nextReset });
        }

        const remaining = Math.max(0, weeklyLimit - userData.ai_credits_used);
        // Calculamos cuándo se reiniciará basándonos en la fecha de inicio del ciclo actual
        const nextReset = new Date(resetAt.getTime() + oneWeekMs);
        return NextResponse.json({ remaining, weeklyLimit, nextReset });

    } catch (error) {
        console.error('Credits fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}