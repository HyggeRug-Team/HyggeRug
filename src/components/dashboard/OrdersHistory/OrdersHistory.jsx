/**
 * @file OrdersHistory.jsx
 * @description Componente interactivo para la gestión y filtrado del historial de pedidos.
 * 
 * [Nuestro enfoque]
 * Hemos transformado el historial estático en una herramienta dinámica de cliente. 
 * Implementamos filtrado por estados y búsqueda en tiempo real para que el usuario 
 * localice sus alfombras al instante.
 * 
 * [Por qué lo hemos hecho así]
 * Al usar Framer Motion y estados de React, conseguimos una interfaz que responde 
 * con suavidad (filtros que se deslizan, tarjetas que aparecen). Esto eleva la percepción 
 * de la web de una simple "página de pedidos" a una aplicación moderna y de alta gama.
 */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OrdersHistory.module.css';
import Link from 'next/link';
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/ui/Buttons/SecondaryButton/SecondaryButton";
import { MdOutlinePayments } from "react-icons/md";
import { 
  FaPalette, 
  FaSpinner, 
  FaTruckFast, 
  FaCircleCheck, 
  FaCalendarDays, 
  FaFileInvoiceDollar,
  FaChevronRight,
  FaBoxOpen,
  FaStore,
  FaMagnifyingGlass,
  FaComment
} from "react-icons/fa6";
import OrderChatModal from '../OrderDetail/OrderChatModal';

export default function OrdersHistory({ initialOrders }) {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatOrder, setShowChatOrder] = useState(null);

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'en curso', label: 'En curso' },
    { id: 'entregados', label: 'Entregados' }
  ];

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'diseñando':
        return { icon: <FaPalette />, text: 'DISEÑANDO', class: styles.statusDesigning, step: 1, type: 'en curso' };
      case 'pendiente de aprobación':
        return { icon: <FaSpinner className={styles.spinIcon} />, text: 'REVISANDO', class: styles.statusProcessing, step: 2, type: 'en curso' };
      case 'comprobando pago':
        return { icon: <MdOutlinePayments/>, text: 'PAGO PENDIENTE', class: styles.statusShipped, step: 3, type: 'en curso' };
      case 'tejiendo':
        return { icon: <FaPalette />, text: 'EN TALLER', class: styles.statusTufting, step: 4, type: 'en curso' };
      case 'enviado':
        return { icon: <FaTruckFast />, text: 'ENVIADO', class: styles.statusShipped, step: 5, type: 'en curso' };
      case 'recibido':
        return { icon: <FaCircleCheck />, text: 'ENTREGADO', class: styles.statusDelivered, step: 6, type: 'entregados' };
      default:
        return { icon: <FaSpinner />, text: status.toUpperCase(), class: styles.statusDefault, step: 1, type: 'en curso' };
    }
  };

  const filteredOrders = initialOrders.filter(order => {
    const statusInfo = getStatusInfo(order.order_status);
    const matchesFilter = activeFilter === 'todos' || statusInfo.type === activeFilter;
    const matchesSearch = order.order_id.toString().includes(searchTerm) || 
                         order.items.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.container}>
      
      {/* FILTROS Y BUSQUEDA */}
      <div className={styles.controls}>
        <div className={styles.filterTabs}>
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`${styles.filterTab} ${activeFilter === filter.id ? styles.activeTab : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
              {activeFilter === filter.id && (
                <motion.div layoutId="activeTab" className={styles.activeIndicator} />
              )}
            </button>
          ))}
        </div>

        <div className={styles.searchWrapper}>
          <FaMagnifyingGlass />
          <input 
            type="text" 
            placeholder="Buscar por ID o producto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA DE PEDIDOS */}
      <div className={styles.ordersGrid}>
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              const statusInfo = getStatusInfo(order.order_status);
              const orderDate = new Date(order.creation_date).toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              });

              return (
                <motion.div
                  key={order.order_id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={styles.orderCard}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.orderIdGroup}>
                       <span className={styles.orderLabel}>ORDEN</span>
                       <span className={styles.orderNumber}>#{order.order_id}</span>
                    </div>
                    <div className={`${styles.statusBadge} ${statusInfo.class}`}>
                       {statusInfo.icon}
                       <span>{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.orderMainInfo}>
                      <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                          <FaCalendarDays />
                          <span>{orderDate}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <FaFileInvoiceDollar />
                          <span>{parseFloat(order.total_amount || 0).toFixed(2)}€</span>
                        </div>
                      </div>

                      <div className={styles.itemsPreview}>
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className={styles.itemThumb}>
                            <img src={item.image_url || '/placeholder-rug.png'} alt={item.product_name} />
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className={styles.moreItems}>+{order.items.length - 2}</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <SecondaryButton 
                        text="AYUDA" 
                        url={`/dashboard/ayuda?order=${order.order_id}`}
                        className={styles.actionBtn}
                      />
                      {order.order_status.toLowerCase() === 'pendiente de aprobación' && (
                        <PrimaryButton 
                          text="CHAT" 
                          Icon={FaComment}
                          onClick={() => setShowChatOrder(order.order_id)}
                          className={`${styles.actionBtn} ${styles.chatActionBtn}`}
                        />
                      )}
                      <PrimaryButton 
                        text="VER DETALLES" 
                        url={`/dashboard/pedidos/${order.order_id}`}
                        Icon={FaChevronRight}
                        className={styles.actionBtn}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyState}
            >
              <FaBoxOpen size={60} />
              <h3>No se encontraron pedidos</h3>
              <p>Intenta con otro filtro o término de búsqueda.</p>
              {activeFilter !== 'todos' && (
                <button onClick={() => setActiveFilter('todos')} className={styles.resetBtn}>
                  Ver todos los pedidos
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showChatOrder && (
          <OrderChatModal 
            orderId={showChatOrder}
            onClose={() => setShowChatOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
