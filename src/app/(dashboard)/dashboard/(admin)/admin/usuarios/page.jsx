/**
 * @file page.jsx
 * @description Panel interactivo de control de usuarios para el administrador.
 * 
 * [Nuestro enfoque]
 * La gestión de usuarios no debe ser una simple tabla fría. En Hygge Rug, cada cliente 
 * es parte de nuestra comunidad. Este panel permite al administrador tener una visión 
 * humana de quién está detrás de cada pedido, facilitando la comunicación directa 
 * y la resolución de dudas en tiempo real.
 * 
 * [Por qué lo hemos hecho así]
 * Hemos optado por una arquitectura de "Single Page" dentro del dashboard que se adapta 
 * dinámicamente según el dispositivo. En escritorio usamos un sistema de doble panel 
 * para máxima productividad, mientras que en dispositivos táctiles la interfaz muta 
 * a una experiencia de "App Nativa" con transiciones fluidas.
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';

import {
  FaUser,
  FaMagnifyingGlass,
  FaFilter,
  FaSpinner,
  FaEnvelope,
  FaCalendarDays,
  FaBagShopping,
  FaCoins,
  FaShield,
  FaComment,
  FaXmark,
  FaPaperPlane,
  FaChevronDown,
  FaCircleUser,
  FaPalette,
  FaTruckFast,
  FaCircleCheck,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6';
import { MdOutlinePayments } from 'react-icons/md';

/* ─────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE ESTADOS Y ETIQUETAS
   ───────────────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  'diseñando':                { label: 'Diseñando',             color: 'var(--highlight-text)', icon: <FaPalette /> },
  'pendiente de aprobación':  { label: 'Pend. Aprobación',      color: 'var(--hover-text)',     icon: <FaSpinner /> },
  'comprobando pago':         { label: 'Comprobando Pago',       color: 'orange',               icon: <MdOutlinePayments /> },
  'tejiendo':                 { label: 'Tejiendo',              color: '#c975ff',              icon: <FaPalette /> },
  'enviado':                  { label: 'Enviado',               color: 'var(--button-before-hover, #00bfff)', icon: <FaTruckFast /> },
  'recibido':                 { label: 'Entregado',             color: '#00ff80',              icon: <FaCircleCheck /> },
};

const ROLE_LABELS = {
  admin:    { label: 'Admin',    color: 'var(--highlight-text)' },
  customer: { label: 'Cliente',  color: 'var(--hover-text)' },
};

/* ─────────────────────────────────────────────────────────────────
   UTILIDADES
   ───────────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatCurrency(amount) {
  return parseFloat(amount || 0).toFixed(2) + '€';
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL (CLIENT)
   ───────────────────────────────────────────────────────────────── */

export default function AdminUsuariosPage() {
  const isTouch = useIsTouchDevice();
  const [users, setUsers]                   = useState([]);
  const [loadingUsers, setLoadingUsers]     = useState(true);
  const [selectedUser, setSelectedUser]     = useState(null);
  const [userDetail, setUserDetail]         = useState(null);  // { user, orders }
  const [loadingDetail, setLoadingDetail]   = useState(false);
  const [search, setSearch]                 = useState('');
  const [roleFilter, setRoleFilter]         = useState('all');
  const [chatOrder, setChatOrder]           = useState(null);
  const [view, setView]                     = useState('list'); // 'list' o 'detail' (móvil)

  // Carga inicial de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  /* ── Filtrado local de usuarios ── */
  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.nickname?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.rol === roleFilter;
    return matchSearch && matchRole;
  });

  /* ── Carga el detalle completo de un usuario ── */
  const loadUserDetail = useCallback(async (userId) => {
    setLoadingDetail(true);
    setUserDetail(null);
    setChatOrder(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error('Error al cargar usuario');
      const data = await res.json();
      setUserDetail(data);
    } catch (err) {
      console.error('[AdminUsers] Error al cargar detalle:', err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  /* ── Al seleccionar un usuario ── */
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    loadUserDetail(user.user_id);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
  };

  if (loadingUsers) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinIcon} />
        <p>Sincronizando base de usuarios...</p>
      </div>
    );
  }

  /* ── RENDERIZADO DEL COMPONENTE ── */
  return (
    <div className={styles.container}>

      {/* ── CABECERA ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Usuarios</h1>
          {!isTouch && <span className={styles.totalBadge}>{users.length} registrados</span>}
        </div>
        {!isTouch && (
          <p className={styles.pageSubtitle}>
            Gestiona cuentas, revisa pedidos e inicia chats con clientes.
          </p>
        )}
      </div>

      {/* ── BARRA DE BÚSQUEDA Y FILTROS ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <FaMagnifyingGlass className={styles.searchIcon} />
          <input
            type="text"
            placeholder={isTouch ? "Buscar..." : "Buscar por nombre o email…"}
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>
              <FaXmark />
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          {!isTouch && <FaFilter className={styles.filterIcon} />}
          {['all', 'customer', 'admin'].map(role => (
            <button
              key={role}
              className={`${styles.filterBtn} ${roleFilter === role ? styles.filterActive : ''}`}
              onClick={() => setRoleFilter(role)}
            >
              {role === 'all' ? 'Todos' : role === 'customer' ? 'Clientes' : 'Admins'}
            </button>
          ))}
        </div>
      </div>

      {/* ── LAYOUT PRINCIPAL ── */}
      <div className={`${styles.mainLayout} ${styles[view]} ${isTouch ? styles.touchLayout : ''}`}>
        
        {/* Columna Lista */}
        <motion.div 
          className={styles.usersList}
          animate={{ x: (isTouch && view === 'detail') ? '-100%' : '0%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <FaUser className={styles.emptyIcon} />
              <p>No se encontraron usuarios</p>
            </div>
          ) : (
            <div className={styles.listScroll}>
              {filteredUsers.map(user => (
                <UserListItem
                  key={user.user_id}
                  user={user}
                  isSelected={selectedUser?.user_id === user.user_id}
                  onSelect={() => handleSelectUser(user)}
                  isTouch={isTouch}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Columna Detalle */}
        <motion.div 
          className={`${styles.detailPanel} ${view === 'detail' ? styles.detailPanelActive : ''}`}
          animate={{ x: (isTouch && view === 'list') ? '100%' : '0%' }}
          initial={isTouch ? { x: '100%' } : false}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <AnimatePresence mode="wait">
            {!selectedUser ? (
              <motion.div key="empty" className={styles.detailEmpty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={styles.detailEmptyIcon}><FaUser /></div>
                <h3>Selecciona un usuario</h3>
                <p>Haz clic en un cliente para ver su historial.</p>
              </motion.div>
            ) : loadingDetail ? (
              <motion.div key="loading" className={styles.detailLoading} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FaSpinner className={styles.spinIcon} />
                <p>Cargando datos…</p>
              </motion.div>
            ) : userDetail ? (
              <motion.div
                key={`detail-${selectedUser.user_id}`}
                className={styles.detailContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <UserDetailPanel
                  user={userDetail.user}
                  orders={userDetail.orders}
                  onOpenChat={setChatOrder}
                  onBack={handleBackToList}
                  isTouch={isTouch}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal de Chat */}
      <AnimatePresence>
        {chatOrder && (
          <ChatModal
            order={chatOrder}
            user={userDetail?.user}
            onClose={() => setChatOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SUB-COMPONENTES INTERNOS
   Separamos la lógica para mantener el componente principal limpio.
   ───────────────────────────────────────────────────────────────── */

function UserListItem({ user, isSelected, onSelect, isTouch }) {
  const roleConfig = ROLE_LABELS[user.rol] || ROLE_LABELS.customer;
  const hasPending = String(user.order_statuses || '').includes('pendiente de aprobación');

  return (
    <motion.button
      layout
      className={`${styles.userItem} ${isSelected ? styles.userItemSelected : ''} ${isTouch ? styles.userItemTouch : ''}`}
      onClick={onSelect}
      whileTap={isTouch ? { scale: 0.98 } : {}}
    >
      <div className={styles.userAvatar}>
        {user.profile_image ? (
          <img src={user.profile_image} alt={user.nickname} />
        ) : (
          <FaCircleUser className={styles.userAvatarFallback} />
        )}
        {hasPending && <span className={styles.pendingDot} />}
      </div>
      <div className={styles.userItemInfo}>
        <div className={styles.userItemTop}>
          <span className={styles.userItemName}>{user.nickname || '—'}</span>
          <span className={styles.roleBadge} style={{ '--role-color': roleConfig.color }}>
            {roleConfig.label}
          </span>
        </div>
        <span className={styles.userItemEmail}>{user.email}</span>
        <div className={styles.userItemStats}>
          <span className={styles.statChip}><FaBagShopping /> {user.total_orders}</span>
          <span className={styles.statChip}><FaCoins /> {formatCurrency(user.total_spent)}</span>
        </div>
      </div>
    </motion.button>
  );
}

/**
 * Panel de detalle del usuario
 * Muestra el perfil, estadísticas y el historial de pedidos con scroll independiente.
 */
function UserDetailPanel({ user, orders, onOpenChat, onBack, isTouch }) {
  const roleConfig = ROLE_LABELS[user.rol] || ROLE_LABELS.customer;

  return (
    <div className={`${styles.detailWrapper} ${isTouch ? styles.detailWrapperTouch : ''}`}>
      <button className={styles.mobileBackBtn} onClick={onBack}>
        <FaArrowUpRightFromSquare style={{ transform: 'rotate(225deg)' }} />
        VOLVER
      </button>

      <div className={styles.profileCard}>
        <div className={styles.profileTop}>
          <div className={styles.profileAvatarWrapper}>
            {user.profile_image ? (
              <img src={user.profile_image} alt={user.nickname} className={styles.profileAvatar} />
            ) : (
              <FaCircleUser className={styles.profileAvatarFallback} />
            )}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileNameRow}>
              <h2 className={styles.profileName}>{user.nickname}</h2>
              <span className={styles.profileRoleBadge} style={{ '--role-color': roleConfig.color }}>
                {roleConfig.label}
              </span>
            </div>
            <div className={styles.profileMeta}>
              <span className={styles.profileMetaItem}><FaEnvelope /> {user.email}</span>
              <span className={styles.profileMetaItem}><FaCalendarDays /> Miembro desde {formatDate(user.creation_date)}</span>
            </div>
          </div>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.profileStat}>
            <span className={styles.profileStatValue}>{orders.length}</span>
            <span className={styles.profileStatLabel}>Pedidos</span>
          </div>
          <div className={styles.profileStatDivider} />
          <div className={styles.profileStat}>
            <span className={styles.profileStatValue}>
              {formatCurrency(orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0))}
            </span>
            <span className={styles.profileStatLabel}>Total gastado</span>
          </div>
          <div className={styles.profileStatDivider} />
          <div className={styles.profileStat}>
            <span className={styles.profileStatValue}>{user.hygge_points ?? 0}</span>
            <span className={styles.profileStatLabel}>Points</span>
          </div>
        </div>
      </div>

      <div className={styles.ordersSection}>
        <h3 className={styles.ordersSectionTitle}><FaBagShopping /> Pedidos del cliente</h3>
        <div className={styles.ordersList}>
          {orders.map(order => (
            <UserOrderCard key={order.order_id} order={order} onOpenChat={onOpenChat} />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserOrderCard({ order, onOpenChat }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[order.order_status] || { label: order.order_status, color: 'var(--grey-500)', icon: null };
  const isPendingApproval = order.order_status === 'pendiente de aprobación';

  return (
    <div className={`${styles.orderCard} ${isPendingApproval ? styles.orderCardPending : ''}`} style={{ '--order-color': statusCfg.color }}>
      <div className={styles.orderCardHeader}>
        <div className={styles.orderCardId}>
          <span className={styles.orderIdLabel}>ORDEN</span>
          <span className={styles.orderIdValue}>#{order.order_id}</span>
        </div>
        <div className={styles.orderCardCenter}>
          <span className={styles.orderStatusBadge} style={{ '--order-color': statusCfg.color }}>
            {statusCfg.icon} {statusCfg.label}
          </span>
          <span className={styles.orderCardDate}>{formatDate(order.creation_date)}</span>
        </div>
        <div className={styles.orderCardRight}>
          <span className={styles.orderCardAmount}>{formatCurrency(order.total_amount)}</span>
          {isPendingApproval && (
            <button className={styles.chatBtn} onClick={() => onOpenChat(order)}><FaComment /> Chat</button>
          )}
          <button className={styles.expandBtn} onClick={() => setExpanded(v => !v)}>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}><FaChevronDown /></motion.div>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div className={styles.orderItems}>
              {order.items?.map((item, idx) => (
                <div key={idx} className={styles.orderItem}>
                  <div className={styles.orderItemThumb}>
                    {item.image_url ? <img src={item.image_url} alt={item.product_name} /> : <FaPalette />}
                  </div>
                  <div className={styles.orderItemInfo}>
                    <span className={styles.orderItemName}>{item.product_name}</span>
                    <span className={styles.orderItemMeta}>x{item.quantity} · {formatCurrency(item.unit_price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatModal({ order, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${order.order_id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [order.order_id]);

  useEffect(() => {
    fetchMessages();
    const int = setInterval(fetchMessages, 5000);
    return () => clearInterval(int);
  }, [fetchMessages]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/orders/${order.order_id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });
      if (res.ok) { setInput(''); fetchMessages(); }
    } finally { setSending(false); }
  };

  return (
    <motion.div className={styles.chatBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className={styles.chatModal} initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.chatAvatarWrapper}>
              {user?.profile_image ? <img src={user.profile_image} className={styles.chatAvatar} /> : <FaCircleUser />}
              <span className={styles.chatOnlineDot} />
            </div>
            <div>
              <p className={styles.chatUserName}>{user?.nickname || 'Cliente'}</p>
              <p className={styles.chatOrderRef}>Pedido #{order.order_id}</p>
            </div>
          </div>
          <button className={styles.chatCloseBtn} onClick={onClose}><FaXmark /></button>
        </div>
        <div className={styles.chatMessages}>
          {messages.map(msg => (
            <div key={msg.message_id} className={`${styles.chatBubble} ${msg.sender_role === 'admin' ? styles.chatBubbleAdmin : styles.chatBubbleClient}`}>
              <p>{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.chatInputArea}>
          <textarea className={styles.chatInput} value={input} onChange={e => setInput(e.target.value)} rows={1} />
          <button className={styles.chatSendBtn} onClick={handleSend} disabled={!input.trim()}><FaPaperPlane /></button>
        </div>
      </motion.div>
    </motion.div>
  );
}
