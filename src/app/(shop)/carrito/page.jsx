import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CartPageClient from '@/components/store/CartPageClient/CartPageClient';

// Redirige al login si no hay sesión activa
export default async function CartPage() {
    const session = await getSession();
    if (!session?.userId) redirect('/auth');

    return <CartPageClient />;
}