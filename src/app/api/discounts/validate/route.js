// ENDPOINT PARA EL PASO FINAL DEL CHECKOUT: VALIDAR CUPÓN.
import { NextResponse } from 'next/server';
import { validateDiscountCode } from '@/lib/db/discounts';

// POST se usa para que un hacker no pueda interceptar el código fácilmente como pasa en una url /api/?codigo=...
// El Frontend nos envia el código escondido en el "body" del fetch
export async function POST(request) {
    try {
        const body = await request.json();
        const { code, orderAmount } = body; // Reciclamos las variables que provengan del carrito

        if (!code || typeof orderAmount !== 'number') {
            return NextResponse.json(
                { error: 'Tu carrito no nos mandó el Coste Total o el Código. Prueba en 5min.' },
                { status: 400 } // Error porque tu frontend falló al enviar mal los datos
            );
        }

        // Checkeador absoluto
        const discount = await validateDiscountCode(code, orderAmount);

        // ¿El código estaba inventado, caducado, limite de envios alcanzado o carrito bajo?
        if (!discount) {
            // Mandamos status 200 normal porque "El server" funciona perfecto y ha evaluado a falso, no es un error de sistema.
            return NextResponse.json(
                { valid: false, error: 'Código no válido o importe de alfombra insuficiente.' },
                { status: 200 } 
            );
        }

        // Si ha llegado vivo aquí -> Felicidades! Envíamos la propina al Frontend para que descuente el precio visualmente.
        return NextResponse.json({
            valid: true,
            discount: {
                code_id:        discount.code_id,
                code:           discount.code,
                discount_type:  discount.discount_type,   // puede ser string 'percentage'(10%) o 'fixed' (-10€)
                discount_value: discount.discount_value,
            },
        });
    } catch (error) {
        console.error('[POST /api/discounts/validate]', error);
        return NextResponse.json(
            { error: 'Explotamos validando codigos descuento, lo sentimos D:' },
            { status: 500 }
        );
    }
}
