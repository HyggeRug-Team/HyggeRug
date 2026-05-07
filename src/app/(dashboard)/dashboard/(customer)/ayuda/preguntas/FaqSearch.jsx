'use client';

/**
 * @file FaqSearch.jsx
 * @description Componente interactivo para la búsqueda y filtrado de preguntas frecuentes.
 * 
 * [Nuestro enfoque]
 * Centralizamos la lógica de filtrado en el cliente para una respuesta instantánea. 
 * Si el usuario no encuentra respuesta, permitimos invocar el Asistente de Soporte 
 * en formato de ventana emergente (modal).
 * 
 * [Por qué lo hemos hecho así]
 * Separar la búsqueda interactiva permite mantener la página principal como Server Component, 
 * optimizando la carga de datos (pedidos) sin sacrificar la agilidad de la interfaz.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from "./preguntas.module.css";
import { 
  FaChevronDown,
  FaCircleQuestion,
  FaMagnifyingGlass,
  FaLightbulb,
  FaTruckFast,
  FaPalette,
  FaCreditCard
} from "react-icons/fa6";
import SupportWizard from "@/components/dashboard/SupportWizard/SupportWizard";
import SecondaryButton from "@/components/ui/Buttons/SecondaryButton/SecondaryButton";

export default function FaqSearch({ orders = [] }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Todos');
  const [showWizard, setShowWizard] = useState(false);

  const faqData = [
    {
      cat: 'Pedidos',
      icon: <FaTruckFast />,
      questions: [
        { q: '¿Cuánto tarda mi pedido?', a: 'Entre 5 y 10 días laborables, ya que cada alfombra se hace a mano.' },
        { q: '¿Cómo rastreo el paquete?', a: 'Recibirás un email con el número de seguimiento en cuanto salga del taller.' },
        { q: '¿Hacéis envíos a las islas?', a: 'Sí, enviamos a Baleares y Canarias, aunque el tiempo puede variar.' }
      ]
    },
    {
      cat: 'Diseño',
      icon: <FaPalette />,
      questions: [
        { q: '¿Qué lana utilizáis?', a: 'Lana 100% acrílica de alta resistencia para un acabado suave y duradero.' },
        { q: '¿Cómo limpio mi alfombra?', a: 'Usa aspiradora regularmente y, para manchas, un paño húmedo con jabón neutro.' },
        { q: '¿Se despelucha la alfombra?', a: 'Es normal que suelte algo de fibra al principio, pero cesará con el aspirado.' }
      ]
    },
    {
      cat: 'Pagos',
      icon: <FaCreditCard />,
      questions: [
        { q: '¿Es seguro el pago?', a: 'Sí, usamos Stripe para garantizar la seguridad de tus datos bancarios.' },
        { q: '¿Puedo cancelar un pedido?', a: 'Tienes 24h desde la compra para cancelar antes de que empecemos la fabricación.' }
      ]
    }
  ];

  const filteredFaqs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      (q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())) &&
      (activeCat === 'Todos' || activeCat === category.cat)
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <>
      {/* BARRA DE BÚSQUEDA */}
      <div className={styles.searchWrapper}>
         <FaMagnifyingGlass className={styles.searchIcon} />
         <input 
          type="text" 
          placeholder="Busca por palabras clave (ej: limpieza, envío...)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      {/* CHIPS DE CATEGORÍA */}
      <div className={styles.categoryChips}>
         {['Todos', 'Pedidos', 'Diseño', 'Pagos'].map(c => (
           <button 
            key={c}
            className={`${styles.chip} ${activeCat === c ? styles.activeChip : ''}`}
            onClick={() => setActiveCat(c)}
           >
             {c}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {filteredFaqs.length > 0 ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.faqList}
          >
             {filteredFaqs.map((category, idx) => (
               <section key={idx} className={styles.faqSection}>
                  <div className={styles.sectionTitle}>
                     {category.icon}
                     <h2>{category.cat}</h2>
                  </div>
                  <div className={styles.questionsGrid}>
                     {category.questions.map((item, i) => (
                       <details key={i} className={styles.faqItem}>
                          <summary>{item.q} <FaChevronDown /></summary>
                          <div className={styles.answer}>
                             <FaLightbulb />
                             <p>{item.a}</p>
                          </div>
                       </details>
                     ))}
                  </div>
               </section>
             ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.emptyResults}
          >
             <FaCircleQuestion size={50} />
             <h3>No hemos encontrado resultados</h3>
             <p>Prueba con otras palabras o contacta directamente con nosotros.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA DE AYUDA DIRECTA */}
      <section className={styles.supportCta}>
         <div className={styles.ctaCard}>
            <div className={styles.ctaText}>
               <h2>¿Sigues con dudas?</h2>
               <p>Si tu consulta es muy específica, nuestro equipo de artesanos te ayudará personalmente.</p>
            </div>
            <SecondaryButton 
              text="ABRIR TICKET DE AYUDA" 
              onClick={() => setShowWizard(true)} 
              variant="whitePink"
            />
         </div>
      </section>

      {/* MODAL DEL WIZARD */}
      <AnimatePresence>
        {showWizard && (
          <SupportWizard 
            orders={orders} 
            onClose={() => setShowWizard(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
