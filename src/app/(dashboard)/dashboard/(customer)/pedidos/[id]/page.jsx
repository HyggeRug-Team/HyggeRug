/**
 * @file pedidos/[id]/page.jsx
 * @description Vista detallada de un pedido específico.
 * 
 * [Nuestro enfoque]
 * Esta página es la culminación de la transparencia en la compra. Mostramos cada detalle 
 * técnico (dirección, desglose de precios, artículos) y un rastreador visual vertical que 
 * guía al usuario a través del ciclo de vida artesanal de su producto.
 * 
 * [Por qué lo hemos hecho así]
 * Para productos personalizados de alto valor emocional como una alfombra Tufting, 
 * la información detallada es clave. Al centralizar todo en una vista limpia y organizada, 
 * generamos una sensación de seguridad y profesionalidad inigualable.
 */
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrderById } from "@/lib/db/orders";
import { getConfigValues } from "@/lib/db/config";
import OrderDetailClient from "@/components/dashboard/OrderDetail/OrderDetailClient";
import styles from "@/components/dashboard/OrderDetail/OrderDetail.module.css";
import { FaBoxOpen } from "react-icons/fa6";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Pedido #${id} | Hygge Rug`,
    description: `Detalles del pedido #${id}`,
  };
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  
  // ── Gestión de sesión y seguridad ──
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  // ── Carga de datos ──
  // Traemos el pedido y los datos de contacto para pagos (Bizum/IBAN)
  const [order, config] = await Promise.all([
    getOrderById(id),
    getConfigValues(["bizum_phone", "bank_account"])
  ]);

  // Verificamos propiedad del pedido
  if (!order || order.user_id !== session.userId) {
    return (
      <div className={styles.errorContainer}>
        <FaBoxOpen size={80} color="var(--grey-600)" />
        <h1>Pedido no encontrado</h1>
        <p>No tienes permisos para ver este pedido o no existe.</p>
        <Link href="/dashboard/pedidos" className={styles.backLink}>
          Volver al historial
        </Link>
      </div>
    );
  }

  // Delegamos el renderizado al componente de cliente para manejar la vista táctil
  return (
    <Suspense fallback={<div>Cargando detalles...</div>}>
      <OrderDetailClient order={order} config={config} />
    </Suspense>
  );
}
