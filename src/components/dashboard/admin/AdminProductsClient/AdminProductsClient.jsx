/**
 * @file AdminProductsClient.jsx
 * @description Panel principal para la gestión del catálogo de diseños desde la administración.
 */
'use client';

import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaStore } from 'react-icons/fa6';

import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import ProductsToolbar from '@/components/dashboard/admin/productComponents/ProductsToolbar';
import ProductCard from '@/components/dashboard/admin/productComponents/ProductCard';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';
import styles from './AdminProductsClient.module.css';

/* Los modales se cargan solo cuando el usuario los abre — fuera del bundle inicial */
const ProductModal = dynamic(
  () => import('@/components/dashboard/admin/productComponents/ProductModal'),
  { ssr: false }
);

const ConfirmDeleteModal = dynamic(
  () => import('@/components/dashboard/admin/productComponents/ConfirmDeleteModal'),
  { ssr: false }
);

export default function AdminProductsClient({ initialProducts, initialCategories, initialUsers }) {
  const [products, setProducts]           = useState(initialProducts);
  const [search, setSearch]               = useState('');
  const [catFilter, setCatFilter]         = useState('all');
  const [visFilter, setVisFilter]         = useState('all');
  const [modalOpen, setModalOpen]         = useState(false);
  const [editProduct, setEditProduct]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notification, setNotification]   = useState({ isOpen: false, type: 'error', title: '', message: '' });

  const refreshProducts = useCallback(async () => {
    const res = await fetch('/api/admin/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
  }, []);

  const filtered = useMemo(() => {
    const lc = search.toLowerCase();
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(lc)) return false;
      if (catFilter !== 'all' && String(p.category_id) !== catFilter) return false;
      if (visFilter === 'community0' &&  p.community) return false;
      if (visFilter === 'community1' && !p.community) return false;
      return true;
    });
  }, [products, search, catFilter, visFilter]);

  const handleOpenCreate = () => { setEditProduct(null);  setModalOpen(true); };
  const handleOpenEdit   = (p)  => { setEditProduct(p);   setModalOpen(true); };
  const handleCloseModal = ()   => { setModalOpen(false); setEditProduct(null); };
  const handleSaved      = ()   => { handleCloseModal(); refreshProducts(); };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`/api/admin/products/${confirmDelete}`, { method: 'DELETE' });
    setConfirmDelete(null);
    if (!res.ok) {
      const data = await res.json();
      setNotification({ isOpen: true, type: 'error', title: 'No se puede eliminar', message: data.error });
      return;
    }
    refreshProducts();
  };

  return (
    <div className={styles.container}>
      <DashboardHeader
        isAdmin
        title="Gestión de Diseños"
        description={`Catálogo completo de productos. ${products.length} diseños registrados.`}
      />

      <ProductsToolbar
        search={search}           onSearch={setSearch}
        catFilter={catFilter}     onCatFilter={setCatFilter}
        visFilter={visFilter}     onVisFilter={setVisFilter}
        categories={initialCategories}
        onNew={handleOpenCreate}
      />

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <FaStore className={styles.emptyIcon} />
          <p>No se encontraron diseños con esos filtros</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(p => (
            <ProductCard
              key={p.product_id}
              product={p}
              onEdit={() => handleOpenEdit(p)}
              onDelete={() => setConfirmDelete(p.product_id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <ProductModal
            product={editProduct}
            categories={initialCategories}
            users={initialUsers}
            onClose={handleCloseModal}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <ConfirmDeleteModal
            onConfirm={handleDeleteConfirm}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>

      <FeedbackModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
