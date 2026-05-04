'use client';

/**
 * @file SupportWizard.jsx
 * @description Asistente multi-paso para la creación de tickets de soporte técnico.
 * 
 * [Nuestro enfoque]
 * Guía al usuario a través de un flujo lógico de 4 pasos (Categoría -> Contexto -> Detalle -> Resumen).
 * Utilizamos un "Portal" para asegurar que la interfaz flote por encima de cualquier otro 
 * elemento del DOM, evitando conflictos de z-index o recortes de scroll.
 * 
 * [Por qué lo hemos hecho así]
 * 1. Reducción de fricción: Dividir el formulario en pasos evita abrumar al usuario.
 * 2. Datos Estructurados: Al forzar la selección de subcategorías y preferencias, 
 *    facilitamos el trabajo posterior en el ERP/CRM de gestión.
 * 3. Portabilidad: Puede ser invocado desde cualquier página (Ayuda, Dashboard, FAQs) 
 *    pasándole los parámetros de entrada correspondientes.
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SupportWizard.module.css';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaCircleCheck, 
  FaHeadset, 
  FaTruckArrowRight, 
  FaTriangleExclamation
} from "react-icons/fa6";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/ui/Buttons/SecondaryButton/SecondaryButton";
import { createSupportTicket } from "@/lib/actions";
import CustomSelect from "@/components/ui/Inputs/CustomSelect/CustomSelect";

export default function SupportWizard({ orders = [], initialOrderId = null, onClose }) {
  // --- ESTADOS DEL ASISTENTE ---
  const [step, setStep] = useState(initialOrderId ? 2 : 1);
  const [formData, setFormData] = useState({
    orderId: initialOrderId ? String(initialOrderId) : null,
    type: initialOrderId ? 'logistica' : '',
    subType: '',
    reason: '',
    description: '',
    resolution: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tip, setTip] = useState(null);

  // Mapeamos los pedidos para el CustomSelect premium
  const orderOptions = orders.map(o => ({
    value: o.order_id,
    label: `Pedido #${o.order_id} - ${new Date(o.creation_date).toLocaleDateString()}`
  }));

  // Bloqueamos el scroll del body al abrir el modal (efecto popup real)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Lógica de "Hygge Tips": sugerencias inteligentes basadas en lo que escribe el usuario
  useEffect(() => {
    const desc = formData.description.toLowerCase();
    if (desc.includes('tiempo') || desc.includes('tarda')) {
      setTip("Hygge Tip: El proceso artesanal suele tomar entre 5 y 10 días laborables.");
    } else if (desc.includes('limpiar') || desc.includes('mancha')) {
      setTip("Hygge Tip: Usa un paño húmedo con jabón neutro. Evita químicos.");
    } else {
      setTip(null);
    }
  }, [formData.description]);

  // --- CONFIGURACIÓN DE RAMIFICACIÓN (BRANCHING) ---
  const issueTypes = [
    { id: 'asistencia', label: 'Asistencia', icon: <FaHeadset />, desc: 'Dudas sobre materiales o cuidados.' },
    { id: 'logistica', label: 'Logística', icon: <FaTruckArrowRight />, desc: 'Problemas con tu pedido/envío.' },
    { id: 'general', label: 'General', icon: <FaTriangleExclamation />, desc: 'Otras gestiones o sugerencias.' }
  ];

  const subOptions = {
    asistencia: ['Materiales', 'Cuidados', 'Tiempos de Fabricación', 'Diseño'],
    logistica: ['No ha llegado', 'Paquete Dañado', 'Incompleto', 'Dirección Incorrecta'],
    general: ['Sugerencia', 'Fallo en Web', 'Otro']
  };

  const resolutions = {
    logistica: ['Reenvío Urgente', 'Reembolso Parcial', 'Reembolso Total', 'Información Estado'],
    asistencia: ['Aclaración Técnica', 'Guía de Cuidados', 'Modificación de Diseño'],
    general: ['Gestión Manual', 'Solo Feedback']
  };

  // --- VALIDACIÓN POR PASOS ---
  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1 && !formData.type) newErrors.type = "Selecciona una categoría.";
    if (s === 2) {
       if (formData.type === 'logistica' && !formData.orderId) newErrors.orderId = "Es obligatorio vincular un pedido.";
       if (!formData.subType) newErrors.subType = "Selecciona un tema específico.";
    }
    if (s === 3) {
       if (!formData.reason || formData.reason.length < 5) newErrors.reason = "El asunto debe ser más descriptivo.";
       if (!formData.description || formData.description.length < 10) newErrors.description = "Danos un poco más de detalle.";
       if (!formData.resolution) newErrors.resolution = "Dinos qué solución prefieres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  // --- ENVÍO FINAL AL CRM/API ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Estructuramos la descripción para que sea útil en el ERP/CRM
    const finalData = {
      ...formData,
      description: `[Resolución: ${formData.resolution}] [SubTipo: ${formData.subType}] - ${formData.description}`
    };
    
    const result = await createSupportTicket(finalData);
    if (result.success) {
      setIsSuccess(true);
      // Cerramos automáticamente tras el éxito
      setTimeout(() => onClose && onClose(), 3500);
    } else {
      alert("Lo sentimos, hubo un error: " + result.error);
    }
    setIsSubmitting(false);
  };

  // Animaciones de transición entre pasos
  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Renderizado con Portal para asegurar que el popup siempre esté por encima de todo
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles.wizardOverlay}>
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={styles.wizardCard}
      >
        {!isSuccess ? (
          <>
            {/* Cabecera con línea de tiempo */}
            <header className={styles.wizardHeader}>
              <div className={styles.progressTimeline}>
                 {[1, 2, 3, 4].map(s => (
                   <div key={s} className={`${styles.timelineStep} ${step >= s ? styles.stepActive : ''}`}>
                      <div className={styles.stepDot}>{s}</div>
                      {s < 4 && <div className={styles.stepLine} />}
                   </div>
                 ))}
              </div>
              <div className={styles.headerTop}>
                <button className={styles.backBtn} onClick={() => step > 1 ? setStep(step - 1) : onClose()}>
                  <FaArrowLeft />
                </button>
                <div className={styles.headerTitles}>
                   <h2>{formData.type === 'logistica' ? 'Soporte Logístico' : formData.type === 'asistencia' ? 'Centro de Ayuda' : 'Centro de Resolución'}</h2>
                   <p>Paso {step} de 4</p>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>
              </div>
            </header>

            <div className={styles.stepContent}>
              <AnimatePresence mode="wait">
                
                {/* PASO 1: CATEGORÍA PRINCIPAL */}
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.stepInner}>
                    <h3>¿En qué área necesitas apoyo?</h3>
                    <div className={styles.typeGrid}>
                       {issueTypes.map(item => (
                         <button 
                           key={item.id} 
                           className={`${styles.typeCard} ${formData.type === item.id ? styles.cardActive : ''}`}
                           onClick={() => setFormData({...formData, type: item.id})}
                         >
                           <div className={styles.typeIcon}>{item.icon}</div>
                           <div>
                              <strong>{item.label}</strong>
                              <span className={styles.typeDesc}>{item.desc}</span>
                           </div>
                         </button>
                       ))}
                    </div>
                    {errors.type && <p className={styles.errorText}>{errors.type}</p>}
                    <div className={styles.footerActions}>
                       <PrimaryButton text="CONTINUAR" onClick={nextStep} Icon={FaArrowRight} />
                    </div>
                  </motion.div>
                )}

                {/* PASO 2: CONTEXTO Y SUBTEMA */}
                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.stepInner}>
                    <h3>{formData.type === 'logistica' ? 'Vincular un Pedido' : 'Cuéntanos un poco más'}</h3>
                    <div className={styles.inputGroup}>
                       <label>Pedido Relacionado {formData.type === 'logistica' && <span className={styles.req}>*</span>}</label>
                       <CustomSelect 
                        value={formData.orderId}
                        options={orderOptions}
                        onChange={(val) => setFormData({...formData, orderId: val})}
                        placeholder={formData.type === 'logistica' ? 'Selecciona el pedido...' : 'Opcional: Selecciona un pedido'}
                       />
                       {errors.orderId && <p className={styles.errorText}>{errors.orderId}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                       <label>¿De qué trata tu consulta?</label>
                       <div className={styles.subGrid}>
                          {subOptions[formData.type]?.map(st => (
                            <button 
                              key={st}
                              className={`${styles.subBtn} ${formData.subType === st ? styles.subActive : ''}`}
                              onClick={() => setFormData({...formData, subType: st})}
                            >
                              {st}
                            </button>
                          ))}
                       </div>
                       {errors.subType && <p className={styles.errorText}>{errors.subType}</p>}
                    </div>
                    <div className={styles.footerActions}>
                       <PrimaryButton text="SIGUIENTE PASO" onClick={nextStep} Icon={FaArrowRight} />
                    </div>
                  </motion.div>
                )}

                {/* PASO 3: DETALLES Y SOLUCIÓN DESEADA */}
                {step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.stepInner}>
                    <h3>Explícanos tu situación</h3>
                    <div className={styles.inputGroup}>
                      <label>Título del mensaje</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Mi pedido no ha llegado..." 
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      />
                      <label style={{ marginTop: '15px' }}>Descripción detallada</label>
                      <textarea 
                        rows={4} 
                        placeholder="Cuanto más nos cuentes, mejor podremos ayudarte."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                      {tip && <div className={styles.tipText}>{tip}</div>}
                    </div>
                    <div className={styles.inputGroup}>
                       <label>¿Qué solución te gustaría?</label>
                       <div className={styles.resGrid}>
                          {resolutions[formData.type]?.map(res => (
                            <button 
                              key={res}
                              className={`${styles.resBtn} ${formData.resolution === res ? styles.resActive : ''}`}
                              onClick={() => setFormData({...formData, resolution: res})}
                            >
                              {res}
                            </button>
                          ))}
                       </div>
                    </div>
                    {errors.resolution && <p className={styles.errorText}>{errors.resolution}</p>}
                    <div className={styles.footerActions}>
                       <PrimaryButton text="REVISAR RESUMEN" onClick={nextStep} Icon={FaArrowRight} />
                    </div>
                  </motion.div>
                )}

                {/* PASO 4: RESUMEN Y CONFIRMACIÓN */}
                {step === 4 && (
                  <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.stepInner}>
                    <h3>Confirmación de Detalles</h3>
                    <div className={styles.finalSummary}>
                       <div className={styles.sumHeader}>
                          <span className={styles.sumBadge}>{formData.type?.toUpperCase()}</span>
                          <strong>{formData.subType}</strong>
                       </div>
                       <div className={styles.sumBody}>
                          <p><strong>Pedido:</strong> {formData.orderId ? `#${formData.orderId}` : 'No vinculado'}</p>
                          <p><strong>Asunto:</strong> {formData.reason}</p>
                          <p><strong>Preferencia:</strong> <span className={styles.highlight}>{formData.resolution}</span></p>
                       </div>
                    </div>
                    <div className={styles.footerActions}>
                       <PrimaryButton text={isSubmitting ? "ENVIANDO..." : "CONFIRMAR Y ENVIAR"} onClick={handleSubmit} Icon={FaCircleCheck} />
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </>
        ) : (
          /* VISTA DE ÉXITO */
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.successView}>
            <div className={styles.successIcon}><FaCircleCheck /></div>
            <h2>¡Solicitud Recibida!</h2>
            <p>Hemos guardado todos los detalles. Recibirás noticias nuestras muy pronto.</p>
            <div className={styles.ticketId}>ID TICKET: HR-{Math.floor(Math.random() * 9000) + 1000}</div>
            <SecondaryButton text="CERRAR VENTANA" onClick={onClose} style={{ marginTop: '30px' }} />
          </motion.div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
