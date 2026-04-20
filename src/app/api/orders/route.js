// ENDPOINT PARA CREAR Y SACAR MIS PROPIOS PEDIDOS (Solo para gente verificada)
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getOrdersByUser, createOrder } from '@/lib/db/orders';
import { getProductWithSizes } from '@/lib/db/products';

// LISTA TODOS TUS PEDIDOS HISTÓRICOS
export async function GET() {
    try {
        // ¿Vienes con tu "carnet de cookie/JWT"?
        const session = await getSession();
        // Si no tienes carnet (ej. estás deslogueado) te echan
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const orders = await getOrdersByUser(session.userId);
        return NextResponse.json({ orders });
    } catch (error) {
        console.error('[GET /api/orders]', error);
        return NextResponse.json(
            { error: 'Error al obtener los pedidos' },
            { status: 500 }
        );
    }
}

// METE UN NUEVO PEDIDO / CREAR (NACE EL PAYLOAD DEL FRONT)
export async function POST(request) {
    try {
        // 1. OBLIGATORIO LOGUEARSE (Nadie crea pedidos anonimísimos en el sistema)
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // 2. RECIBE LOS DATOS (Body JSON que mandaste con fetch en el FRONTEND)
        const body = await request.json();

        // Extraemos las piezas clave del carrito
        const {
            size_id,
            product_size, // Ej: "100x120" o "Teclado (A MEdida: 50x20)"
            quantity = 1,
            custom_note,
            user_image,
            address_id,
            discount_code_id,
            discount_amount = 0,
            payment_id,
            payment_method,
        } = body;

        // 3. REGLAS BÁSICAS (Si falta algo de esto, cancela la compra por seguridad, error 400 Bad Request)
        if (!size_id || !address_id) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos en el carrito (Medida o Dirección).' },
                { status: 400 }
            );
        }

        // 4. PRECIOS ABSOLUTAMENTE DESDE EL SERVIDOR DE BBDD (Jamás confiar en un precio que mande el frontend HTML)
        const product = await getProductWithSizes(1); // El producto 1 es el que engloba todas las variantes modificables
        const sizeData = product?.sizes.find(s => s.size_id === size_id);

        if (!sizeData) {
            return NextResponse.json(
                { error: 'La talla solicitada ya no existe o está corrompida' },
                { status: 400 }
            );
        }

        // Las matemáticas puras con datos de backends
        const itemPrice   = parseFloat(sizeData.price);
        const subtotal    = itemPrice * quantity;
        const totalAmount = subtotal - parseFloat(discount_amount ?? 0);

        // 5. INSERTA A LA BASE DE DATOS COMO TAL
        const orderId = await createOrder({
            userId:          session.userId,
            addressId:       address_id,
            discountCodeId:  discount_code_id ?? null,
            discountAmount:  discount_amount ?? 0,
            totalAmount:     Math.max(0, totalAmount), // Evitar precios negativos si el descuento es gigante! Math= Matemáticas
            paymentId:       payment_id ?? null,
            paymentMethod:   payment_method ?? null,
            items: [{
                sizeId:      size_id,
                productSize: product_size ?? sizeData.size_label, // Respaldo por nombre real de BBDD
                customNote:  custom_note ?? null,
                price:       itemPrice,
                quantity,
                userImage:   user_image ?? null,
                finalDesign: null,
            }],
        });

        // STATUS 201 significa: "Creado Perfectamente"
        return NextResponse.json({ orderId }, { status: 201 });
    } catch (error) {
        console.error('[POST /api/orders]', error);
        return NextResponse.json(
            { error: 'Error al procesar y almacenar pedido final en BD' },
            { status: 500 }
        );
    }
}
