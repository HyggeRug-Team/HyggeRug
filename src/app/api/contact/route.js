/**
 * @file route.js (api/contact)
 * @description API para procesar el formulario de contacto y enviar notificaciones.
 * 
 * [Nuestro enfoque]
 * Hemos centralizado aquí la recepción de dudas y colaboraciones. Validamos que 
 * todos los campos vengan rellenos antes de disparar el servicio de correo.
 * 
 * [Por qué lo hemos hecho así]
 * Queremos que el contacto con el taller sea directo y fiable, separando la 
 * lógica de envío de la interfaz de usuario para mayor seguridad.
 */
import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mailer';

export async function POST(req) {
    try {
        const data = await req.json();
        const { name, email, subject, message } = data;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        // Enviamos el email al taller
        await sendContactEmail({ name, email, subject, message });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API/CONTACT]', error);
        return NextResponse.json({ error: 'No se pudo enviar el mensaje' }, { status: 500 });
    }
}
