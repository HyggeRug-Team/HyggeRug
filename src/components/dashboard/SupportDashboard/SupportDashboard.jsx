'use client';

/**
 * @file SupportDashboard.jsx
 * @description Panel de control para visualizar y gestionar tickets de soporte.
 * 
 * [Nuestro enfoque]
 * Presentamos una interfaz limpia donde el usuario puede ver el historial de sus 
 * solicitudes de ayuda. La interactividad se gestiona mediante sub-modales internos 
 * (TicketDetailModal) para mantener la fluidez del dashboard principal.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Modularidad Interna: El detalle de cada ticket se maneja mediante una función 
 *    de renderizado dedicada para evitar saturar el componente principal.
 * 2. Datos Limpios: Utilizamos `formatDescription` para separar los metadatos técnicos 
 *    del mensaje real del usuario, mejorando la legibilidad.
 * 3. UX Premium: Utilizamos animaciones de Framer Motion para las transiciones de estados.
 */

import React, { useState } from 'react';
import styles from './SupportDashboard.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCircleQuestion, 
  FaClock, 
  FaCircleCheck, 
  FaXmark, 
  FaChevronRight,
  FaHeadset,
  FaPlus
} from "react-icons/fa6";
import SupportWizard from '../SupportWizard/SupportWizard';

export default function SupportDashboard({ initialTickets = [], orders = [], initialOrderId = null }) {
  const [showWizard, setShowWizard] = useState(!!initialOrderId);
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return { text: 'Abierto', icon: <FaCircleQuestion />, class: styles.statusOpen };
      case 'in_review': return { text: 'En revisión', icon: <FaClock />, class: styles.statusReview };
      case 'resolved': return { text: 'Resuelto', icon: <FaCircleCheck />, class: styles.statusResolved };
      case 'cancelled': return { text: 'Cancelado', icon: <FaXmark />, class: styles.statusCancelled };
      default: return { text: status, icon: <FaCircleQuestion />, class: styles.statusOpen };
    }
  };

  const getTypeLabel = (type) => {
    const t = type?.toLowerCase();
    switch (t) {
      case 'return': return 'Devolución';
      case 'asistencia':
      case 'help': 
        return 'Asistencia';
      case 'logistica':
      case 'delivery_error': 
        return 'Logística';
      case 'general':
      case 'other': 
        return 'General';
      default: return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Soporte';
    }
  };

  // Función para limpiar la descripción de tags técnicos [Resolución...]
  const formatDescription = (desc) => {
    if (!desc) return '';
    // Eliminamos los bloques entre corchetes para mostrar solo el mensaje limpio si se desea,
    // o simplemente devolvemos la parte final.
    const parts = desc.split('] - ');
    return parts.length > 1 ? parts[1] : desc.replace(/\[.*?\]/g, '').trim();
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.dashboardHeader}>
        <div className={styles.headerInfo}>
           <h2>Tus solicitudes de soporte</h2>
           <p>Gestiona tus consultas y devoluciones activas.</p>
        </div>
        {tickets.length > 0 && (
          <button className={styles.newTicketBtn} onClick={() => setShowWizard(true)}>
            <FaPlus /> NUEVA SOLICITUD
          </button>
        )}
      </div>

      <div className={styles.ticketsGrid}>
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => {
            const status = getStatusLabel(ticket.status);
            return (
              <motion.div 
                key={ticket.ticket_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={styles.ticketCard}
              >
                <div className={styles.cardHeader}>
                   <span className={styles.ticketType}>{getTypeLabel(ticket.type)}</span>
                   <div className={`${styles.statusBadge} ${status.class}`}>
                     {status.icon} {status.text}
                   </div>
                </div>
                <div className={styles.cardBody}>
                  <h3>{ticket.reason}</h3>
                  <p className={styles.ticketDesc}>{formatDescription(ticket.description).substring(0, 80)}...</p>
                  <div className={styles.ticketMeta}>
                    {ticket.order_id && (
                      <span className={styles.orderTag}>Pedido #{ticket.order_id}</span>
                    )}
                    <span className={styles.dateTag}>
                      {new Date(ticket.creation_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className={styles.viewDetailsBtn} onClick={() => setSelectedTicket(ticket)}>
                  VER DETALLES <FaChevronRight size={10} />
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><FaHeadset /></div>
            <h3>Sin solicitudes activas</h3>
            <p>Si tienes algún problema con un pedido o una duda, estamos aquí para ayudarte.</p>
            <div style={{ marginTop: '20px' }}>
               <button className={styles.newTicketBtn} onClick={() => setShowWizard(true)}>
                  <FaPlus /> Abrir primer ticket
               </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DEL WIZARD */}
      <AnimatePresence>
        {showWizard && (
          <SupportWizard 
            orders={orders} 
            initialOrderId={initialOrderId}
            onClose={() => setShowWizard(false)} 
          />
        )}
      </AnimatePresence>

      {/* MODAL DE DETALLES DEL TICKET */}
      <AnimatePresence>
        {selectedTicket && (
          <div className={styles.modalOverlay} onClick={() => setSelectedTicket(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={styles.detailModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                 <div className={styles.modalHeaderLeft}>
                    <span className={styles.modalBadge}>{getTypeLabel(selectedTicket.type)}</span>
                    <h2>Ticket #{selectedTicket.ticket_id}</h2>
                 </div>
                 <button className={styles.closeModal} onClick={() => setSelectedTicket(null)}><FaXmark /></button>
              </div>
              
              <div className={styles.modalScroll}>
                 <div className={styles.detailGroup}>
                    <label>Asunto / Motivo</label>
                    <p className={styles.detailReason}>{selectedTicket.reason}</p>
                 </div>

                 <div className={styles.detailRow}>
                    <div className={styles.detailGroup}>
                       <label>Estado Actual</label>
                       <div className={`${styles.statusBadge} ${getStatusLabel(selectedTicket.status).class}`}>
                          {getStatusLabel(selectedTicket.status).icon} {getStatusLabel(selectedTicket.status).text}
                       </div>
                    </div>
                    <div className={styles.detailGroup}>
                       <label>Fecha de Creación</label>
                       <p className={styles.detailDate}>{new Date(selectedTicket.creation_date).toLocaleDateString()}</p>
                    </div>
                 </div>

                 {selectedTicket.order_id && (
                    <div className={styles.detailGroup}>
                       <label>Pedido Vinculado</label>
                       <div className={styles.orderLink}>
                          <span>Pedido #{selectedTicket.order_id}</span>
                       </div>
                    </div>
                 )}

                 <div className={styles.detailGroup}>
                    <label>Mensaje del Cliente</label>
                    <div className={styles.descriptionBox}>
                       {formatDescription(selectedTicket.description)}
                    </div>
                 </div>

                 {/* Extraemos metadatos de la descripción si existen */}
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
              </div>

              <div className={styles.modalFooter}>
                 <button className={styles.closeBtnFooter} onClick={() => setSelectedTicket(null)}>
                    CERRAR DETALLES
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
