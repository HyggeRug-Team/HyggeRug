/**
 * @file AdminSupportClient.jsx
 * @description Panel de gestión de tickets de soporte para el equipo de administración.
 *
 * [Nuestro enfoque]
 * Hemos creado este panel para que el administrador tenga un control claro sobre
 * las incidencias. Hemos priorizado los filtros rápidos y la visibilidad del estado
 * de cada ticket para reducir los tiempos de respuesta al cliente.
 *
 * [Por qué lo hemos hecho así]
 * Hemos incluido filtrado por estado y buscador por ID para que encontrar un ticket sea
 * inmediato, y notificaciones tras cada acción para que el admin sepa que los cambios se guardaron.
 */
'use client';

import React, { useState, useMemo } from 'react';
import styles from './AdminSupportClient.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCircleQuestion,
  FaClock,
  FaCircleCheck,
  FaXmark,
  FaFilter,
  FaMagnifyingGlass,
  FaChevronRight,
  FaHeadset
} from 'react-icons/fa6';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import CustomSelect from '@/components/ui/Inputs/CustomSelect/CustomSelect';
import FeedbackModal from '@/components/ui/Feedback/FeedbackModal';

export default function AdminSupportClient({ initialTickets, session }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const [resolvingStatus, setResolvingStatus] = useState('');
  const [resolutionMessage, setResolutionMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'abierto': return { text: 'Abierto', icon: <FaCircleQuestion />, class: styles.statusOpen };
      case 'en_revision': return { text: 'En revisión', icon: <FaClock />, class: styles.statusReview };
      case 'resuelto': return { text: 'Resuelto', icon: <FaCircleCheck />, class: styles.statusResolved };
      case 'cancelado': return { text: 'Cancelado', icon: <FaXmark />, class: styles.statusCancelled };
      default: return { text: status, icon: <FaCircleQuestion />, class: styles.statusOpen };
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch = 
        t.ticket_id.toString().includes(search) || 
        t.user_nickname?.toLowerCase().includes(search.toLowerCase()) ||
        t.user_email?.toLowerCase().includes(search.toLowerCase()) ||
        t.reason?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'todos' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tickets, search, statusFilter]);

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setResolvingStatus(ticket.status);
    setResolutionMessage(ticket.resolution_message || '');
  };

  const closeTicket = () => {
    setSelectedTicket(null);
  };

  // Guardamos los cambios del ticket (estado y respuesta del taller)
  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/support/${selectedTicket.ticket_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: resolvingStatus,
          resolution_message: resolutionMessage
        })
      });

      if (res.ok) {
        // Si todo va bien, mostramos el modal exclusivo de éxito
        setTickets(prev => prev.map(t => 
          t.ticket_id === selectedTicket.ticket_id 
            ? { ...t, status: resolvingStatus, resolution_message: resolutionMessage } 
            : t
        ));
        setNotification({
          isOpen: true,
          type: 'success',
          title: '¡Ticket Actualizado!',
          message: `El ticket #${selectedTicket.ticket_id} se ha guardado correctamente.`
        });
        closeTicket();
      } else {
        throw new Error('Fallo en la respuesta del servidor');
      }
    } catch (err) {
      // Si falla la red o la BD, avisamos con el modal de error
      console.error(err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error al Guardar',
        message: 'No se han podido guardar los cambios. Revisa la conexión con la base de datos.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDescription = (desc) => {
    if (!desc) return '';
    const parts = desc.split('] - ');
    return parts.length > 1 ? parts[1] : desc.replace(/\[.*?\]/g, '').trim();
  };

  return (
    <div className={styles.container}>
      <DashboardHeader 
        session={session} 
        isAdmin={true} 
        title="Centro de Soporte"
        description={`Gestiona incidencias y tickets. Tienes ${tickets.filter(t => t.status !== 'resuelto').length} casos pendientes.`}
      />

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaMagnifyingGlass className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar por ID, usuario, motivo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterBox} style={{ zIndex: 10 }}>
          <div style={{ width: '220px' }}>
            <CustomSelect 
              value={statusFilter} 
              onChange={val => setStatusFilter(val)}
              options={[
                { value: 'todos', label: 'Todos los estados' },
                { value: 'abierto', label: 'Abiertos' },
                { value: 'en_revision', label: 'En revisión' },
                { value: 'resuelto', label: 'Resueltos' },
                { value: 'cancelado', label: 'Cancelados' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* LISTA DE TICKETS */}
      <div className={styles.ticketsGrid}>
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => {
            const status = getStatusLabel(ticket.status);
            return (
              <motion.div 
                key={ticket.ticket_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={styles.ticketCard}
                onClick={() => openTicket(ticket)}
              >
                <div className={styles.cardHeader}>
                   <span className={styles.ticketType}>{ticket.type}</span>
                   <div className={`${styles.statusBadge} ${status.class}`}>
                     {status.icon} {status.text}
                   </div>
                </div>
                <div className={styles.cardBody}>
                  <h3>{ticket.reason}</h3>
                  <p className={styles.ticketDesc}>{formatDescription(ticket.description).substring(0, 80)}...</p>
                  <div className={styles.ticketMeta}>
                    <span className={styles.userTag}>
                      <img src={ticket.user_image || '/profile-default.png'} alt="user" className={styles.userImg} />
                      {ticket.user_nickname}
                    </span>
                    <span className={styles.dateTag}>
                      {new Date(ticket.creation_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><FaHeadset /></div>
            <h3>Sin resultados</h3>
            <p>No se encontraron tickets que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      {/* MODAL DEL TICKET */}
      <AnimatePresence>
        {selectedTicket && (
          <div className={styles.modalOverlay} onClick={closeTicket}>
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={styles.detailModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                 <div className={styles.modalHeaderLeft}>
                    <span className={styles.modalBadge}>Ticket #{selectedTicket.ticket_id}</span>
                    <h2>{selectedTicket.reason}</h2>
                 </div>
                 <button className={styles.closeModal} onClick={closeTicket}><FaXmark /></button>
              </div>
              
              <div className={styles.modalScroll} data-lenis-prevent>
                 
                 <div className={styles.userInfoBox}>
                    <img src={selectedTicket.user_image || '/profile-default.png'} alt="avatar" />
                    <div>
                      <p><strong>{selectedTicket.user_nickname}</strong></p>
                      <p>{selectedTicket.user_email}</p>
                    </div>
                 </div>

                 {selectedTicket.order_id && (
                   <div className={styles.orderInfoBox}>
                     <p><strong>Pedido Vinculado:</strong> #{selectedTicket.order_id}</p>
                     <p><strong>Total:</strong> {selectedTicket.total_amount}€</p>
                   </div>
                 )}

                 <div className={styles.detailGroup}>
                    <label>Mensaje del Cliente</label>
                    <div className={styles.descriptionBox}>
                       {formatDescription(selectedTicket.description)}
                    </div>
                 </div>

                 <div className={styles.metaGrid}>
                    {selectedTicket.description.includes('[SubTipo:') && (
                       <div className={styles.miniDetail}>
                          <label>Subcategoría</label>
                          <p>{selectedTicket.description.match(/\[SubTipo: (.*?)\]/)?.[1]}</p>
                       </div>
                    )}
                    {selectedTicket.description.includes('[Resolución:') && (
                       <div className={styles.miniDetail}>
                          <label>Preferencia</label>
                          <p>{selectedTicket.description.match(/\[Resolución: (.*?)\]/)?.[1]}</p>
                       </div>
                    )}
                 </div>

                 <hr className={styles.divider} />

                 <div className={styles.detailGroup} style={{ position: 'relative', zIndex: 11 }}>
                    <label>Cambiar Estado</label>
                    <CustomSelect 
                      value={resolvingStatus} 
                      onChange={val => setResolvingStatus(val)}
                      direction="up"
                      options={[
                        { value: 'abierto', label: 'Abierto' },
                        { value: 'en_revision', label: 'En revisión' },
                        { value: 'resuelto', label: 'Resuelto' },
                        { value: 'cancelado', label: 'Cancelado' }
                      ]}
                    />
                 </div>

                 <div className={styles.detailGroup}>
                    <label>Mensaje de Resolución (Visible para el usuario)</label>
                    <textarea 
                      value={resolutionMessage}
                      onChange={e => setResolutionMessage(e.target.value)}
                      placeholder="Escribe la respuesta o solución al problema..."
                      className={styles.formTextarea}
                    />
                 </div>

              </div>

              <div className={styles.modalFooter}>
                 <button className={styles.closeBtnFooter} onClick={closeTicket}>Cancelar</button>
                 <button 
                   className={styles.saveBtn} 
                   onClick={handleUpdateTicket}
                   disabled={isUpdating}
                 >
                   {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FeedbackModal 
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </div>
  );
}
