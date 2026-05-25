/**
 * @file OrderChatModal.jsx
 * @description Modal de chat para que el cliente se comunique con el admin sobre su pedido.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaXmark, 
  FaPaperPlane, 
  FaCircleUser, 
  FaSpinner,
  FaHeadset
} from 'react-icons/fa6';
import styles from './OrderChatModal.module.css';

export default function OrderChatModal({ orderId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Cargar mensajes al abrir
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Error al cargar mensajes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Polling cada 5 segundos para nuevos mensajes
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        setInput('');
        // Recarga inmediata
        const resMsg = await fetch(`/api/orders/${orderId}/messages`);
        if (resMsg.ok) {
          const data = await resMsg.json();
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <FaHeadset size={20} />
            </div>
            <div className={styles.headerText}>
              <h3>Chat de Pedido #{orderId}</h3>
              <p>Hygge Rug Support</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaXmark />
          </button>
        </header>

        <div className={styles.messagesContainer} data-lenis-prevent>
          {loading ? (
            <div className={styles.loading}>
              <FaSpinner className={styles.spin} />
              <p>Cargando conversación...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className={styles.empty}>
              <p>No hay mensajes todavía. ¿Tienes alguna duda sobre tu diseño o el proceso?</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.message_id} 
                className={`${styles.bubbleWrapper} ${msg.sender_role === 'customer' ? styles.bubbleCustomer : styles.bubbleAdmin}`}
              >
                <div className={styles.bubble}>
                  <p>{msg.message}</p>
                  <span className={styles.time}>
                    {new Date(msg.creation_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje aquí..."
            disabled={sending}
          />
          <button 
            className={styles.sendBtn} 
            onClick={handleSend}
            disabled={!input.trim() || sending}
          >
            {sending ? <FaSpinner className={styles.spin} /> : <FaPaperPlane />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
