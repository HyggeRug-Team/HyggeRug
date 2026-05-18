/**
 * @file admin/productos/page.jsx
 * @description Página de administración para la gestión del catálogo de diseños.
 */
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminProductsClient from '@/components/dashboard/admin/AdminProductsClient/AdminProductsClient';
import { getAdminProducts, getCategories } from '@/lib/db/products';
import { db } from '@/lib/db';

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

  const [products, categories, usersRes] = await Promise.all([
    getAdminProducts(), 
    getCategories(),
    db.query('SELECT user_id, nickname FROM users ORDER BY nickname ASC')
  ]);

  const users = usersRes[0];

  return (
    <AdminProductsClient
      initialProducts={products}
      initialCategories={categories}
      initialUsers={users}
    />
  );
}
