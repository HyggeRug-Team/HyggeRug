'use client';

/**
 * @file page.jsx (Sobre Nosotros)
 * @description Página de "Sobre Nosotros" de Hygge Rug.
 * 
 * [Nuestro enfoque]
 * Rediseño visual definitivo reutilizando todos los componentes de la interfaz de usuario 
 * (UI Components) del proyecto para mantener una consistencia absoluta. 
 * "Un poco de todo" para una experiencia rica y perfectamente ensamblada.
 */

import React from 'react';
import Image from 'next/image';
import { FaHeart, FaMagic, FaPalette, FaUsers, FaUserAstronaut, FaFireAlt, FaRegHandshake } from 'react-icons/fa';

// Importación MASIVA de componentes UI del proyecto para reutilizarlos al máximo
// SectionWrapper import removed as we use local pageContainer for global background
import HeroTitle from '@/components/ui/Titles/HeroTitle/HeroTitle';
import CuteMessage from '@/components/ui/CuteMessage/CuteMessage';
import FeatureCard from '@/components/ui/Cards/FeatureCard/FeatureCard';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import Timeline from '@/components/ui/Timeline/Timeline';
import StatsCard from '@/components/ui/Cards/StatsCard/StatsCard';
import ReviewSticker from '@/components/ui/Cards/ReviewSticker/ReviewSticker';
import CtaBanner from '@/components/ui/Banners/CtaBanner/CtaBanner';
import MarqueeStrip from '@/components/sections/MarqueeStrip/MarqueeStrip';
import Breadcrumbs from '@/components/ui/Breadcrumbs/Breadcrumbs';

import styles from './page.module.css';

export default function AboutUsPage() {
  
  // Datos para los FeatureCards (Las 3 Opciones de Compra pedidas en el prompt)
  const purchaseOptions = [
    {
      icon: <FaUsers size={32} color="var(--accent-purple)" />,
      title: "Diseños de la Comunidad",
      desc: "Alfombras de diseños que otros usuarios han pedido anteriormente y que están disponibles en nuestro catálogo.",
      delay: 0.1
    },
    {
      icon: <FaMagic size={32} color="var(--accent-cyan)" />,
      title: "Generación por Inteligencia Artificial",
      desc: "Introduce un texto (prompt) o una imagen en nuestra web, la IA genera un diseño único y yo lo convierto en una alfombra real.",
      delay: 0.2
    },
    {
      icon: <FaPalette size={32} color="var(--highlight-text)" />,
      title: "Personalización Total",
      desc: "El cliente me envía directamente la imagen o idea que quiere y yo me encargo de hacer la alfombra a medida.",
      delay: 0.3
    }
  ];

  // Datos para el Timeline (El proceso artesanal)
  const processSteps = [
    { num: "1", title: "Diseño & Boceto", desc: "Ajusto tu idea al lienzo, prestando atención al cliente de tú a tú." },
    { num: "2", title: "Tufting", desc: "Disparo la lana con la pistola de tufting, punto a punto con total dedicación." },
    { num: "3", title: "Encolado & Secado", desc: "Sello la alfombra para asegurar una durabilidad premium." },
    { num: "4", title: "Carving (Relieve)", desc: "Esculpo los bordes a tijera para dar ese efecto 3D característico." },
  ];

  // Datos para los Testimonios (ReviewStickers)
  const testimonials = [
    { text: "El nivel de detalle es increíble. El mejor complemento para mi set up.", author: "CARLOS H.", rating: 5, rotation: -3, variant: "secondary" },
    { text: "Lana premium y un agarre bestial. Se nota el trabajo a mano.", author: "ANA B.", rating: 5, rotation: 4, variant: "secondary" },
    { text: "Le di una idea loquísima y el relieve 3D superó mis expectativas.", author: "DANI R.", rating: 5, rotation: -2, variant: "secondary" },
  ];

  return (
    <>
      <div className={styles.pageContainer}>
        <Breadcrumbs items={[{ label: 'Sobre Nosotros' }]} />
        
        {/* 1. HERO TITLE & CUTE MESSAGE */}
        <div className={styles.heroContent}>
            <CuteMessage Icon={FaFireAlt} text="100% Hecho a Mano en Madrid" />
            <HeroTitle 
                line1="EL ALMA DE" 
                line2="HYGGE RUG" 
                subtitle="Transformando hilos en sensaciones, una alfombra a la vez." 
            />
            
            <div className={styles.imageWrapper}>
                <Image 
                    src="/images/about/workshop.png" 
                    alt="Taller de Tufting Hygge Rug" 
                    fill 
                    priority 
                />
            </div>

            <p style={{ fontSize: '1.4rem', color: 'var(--secondary-text)', maxWidth: '800px', lineHeight: '1.8', margin: '0 auto' }}>
                Bienvenidos a mi taller. Soy una única persona emprendedora que se encarga de todo el proceso: desde el diseño y la atención al cliente hasta la fabricación de cada alfombra. Quiero transmitirte cercanía, dedicación, la calidez de lo hecho a mano y el concepto de <strong>'Hygge'</strong> (comodidad, hogar, bienestar).
            </p>
        </div>

        {/* 2. STATS CARDS (Mini Dashboard) */}
        <div className={styles.statsGrid}>
            <StatsCard bigText="1" smallText="Artesano Apasionado" color="var(--accent-purple)" Icon={FaUserAstronaut} />
            <StatsCard bigText="100%" smallText="Dedicación y Mimo" color="var(--accent-cyan)" Icon={FaHeart} />
            <StatsCard bigText="3" smallText="Formas de Crear" color="var(--highlight-text)" Icon={FaPalette} />
        </div>

        {/* 3. FEATURE CARDS (Opciones de Compra) */}
        <div style={{ marginTop: '6rem' }}>
            <SectionHeader 
                badge="NUESTRA OFERTA" 
                icon={FaPalette} 
                title="¿QUÉ VENDEMOS?" 
                description="Tenemos 3 formas diferentes de traer el arte textil a tu suelo." 
            />
            <div className={styles.featuresGrid}>
                {purchaseOptions.map((opt, i) => (
                    <FeatureCard key={i} icon={opt.icon} title={opt.title} desc={opt.desc} delay={opt.delay} />
                ))}
            </div>
        </div>

        {/* 4. TIMELINE (El Proceso) */}
        <div style={{ marginTop: '6rem' }}>
            <SectionHeader 
                badge="PASO A PASO" 
                icon={FaRegHandshake} 
                title="DEL BOCETO A TU HOGAR" 
                description="Conoce el proceso completo detrás de cada obra de arte." 
            />
            <div className={styles.timelineWrapper}>
                <Timeline steps={processSteps} />
            </div>
        </div>

        {/* 5. REVIEW STICKERS (Testimonios) */}
        <div style={{ marginTop: '6rem' }}>
            <SectionHeader 
                badge="HYGGE GANG" 
                icon={FaUsers} 
                title="LA CALLE HABLA" 
                description="Lo que opinan los que ya tienen su pedazo de Hygge." 
            />
            <div className={styles.reviewsGrid}>
                {testimonials.map((test, i) => (
                    <ReviewSticker key={i} {...test} />
                ))}
            </div>
        </div>

        {/* 6. CTA BANNER (Cierre) */}
        <div style={{ marginTop: '6rem', marginBottom: '2rem' }}>
            <CtaBanner 
                title="¿LISTO PARA TU PROPIA ALFOMBRA?" 
                text="Ya tienes la idea, ahora déjame ponerle los hilos. Convierte ese diseño en la pieza central de tu hogar." 
                btnText="CONTÁCTAME AHORA" 
                btnUrl="/contacto" 
            />
        </div>

      </div>

      {/* 7. MARQUEE STRIP (Rodapié dinámico) */}
      <MarqueeStrip />
    </>
  );
}
