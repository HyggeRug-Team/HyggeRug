import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminProductsClient from '@/components/dashboard/admin/AdminProductsClient/AdminProductsClient';
import { getAdminProducts, getCategories } from '@/lib/db/products';

export const metadata = {
  title: 'Gestión de Diseños | Admin Hygge Rug',
};

export default async function AdminProductosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const session = await verifySession(token);

  if (!session || session.role !== 'admin') {
    redirect('/auth');
  }

  const [products, categories] = await Promise.all([getAdminProducts(), getCategories()]);

  return (
    <AdminProductsClient
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
