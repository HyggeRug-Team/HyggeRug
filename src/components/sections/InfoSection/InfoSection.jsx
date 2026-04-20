/**
 * @file InfoSection.jsx
 * @description Área informativa sobre la artesanía de la marca (Tufting real), Laboratorio IA y reseñas.
 *
 * [Nuestro enfoque]
 * Dividimos la compleja información artesanal en bloques ágiles: una introducción corta 
 * y rotunda, un grid de tarjetas de proceso (ProcessCard), un espacio enmarcado para 
 * la tecnología (Banner IA) y las pegatinas de reseñas (ReviewSticker).
 *
 * [Por qué lo hemos hecho así]
 * Para lograr la retención de clientes en un negocio Made-to-Order artesanal, se debían
 * explicar los procesos, sin caer en muros de texto aburridos. Optamos por la síntesis 
 * agresiva (estética pop grunge) garantizando legibilidad y confianza en el creador de Madrid.
 */
"use client";
import React from "react";
import styles from "./InfoSection.module.css";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import ProcessCard from "@/components/ui/Cards/ProcessCard/ProcessCard";
import ReviewSticker from "@/components/ui/Cards/ReviewSticker/ReviewSticker";

function InfoSection() {
  const processSteps = [
    {
      number: "01",
      title: "EXPLORA EL CATÁLOGO",
      description: "Elige una pieza de nuestro catálogo o envíame tu propia idea personal para hacerla realidad.",
      visualBg: "#111",
      visualContent: <div style={{ color: '#FFF', fontWeight: '900', fontSize: '0.8rem', border: '2px solid #555', padding: '8px 12px', transform: 'rotate(-5deg)' }}>TUFTING ART</div>
    },
    {
      number: "02",
      title: "CRAFTING EN MADRID",
      description: "Inyecto lana de alta calidad con la tufting gun, remato la trasera con TPR anti-deslizante y perfilo cada relieve en 3D.",
      visualBg: "var(--accent-purple)",
      visualContent: <div className={styles.innerPrompt}>"100% ARTESANAL"</div>
    },
    {
      number: "03",
      title: "DIRECTO A TU ESPACIO",
      description: "Recíbela en casa y dale un toque exclusivo a tu setup, a tu salón o a tu habitación.",
      visualBg: "var(--highlight-text)",
      visualContent: <div className={styles.rugIcon}></div>
    }
  ];

  const testimonials = [
    {
      text: "Le di un diseño loquísimo y lo clavaron. Los bordes en 3D le dan mil vueltas a las alfombras comerciales.",
      author: "DANI R., Cliente Verificado",
      rating: 5,
      rotation: -3,
      variant: "secondary"
    },
    {
      text: "El nivel de detalle es increíble. El mejor complemento para mi stream room sin ninguna duda.",
      author: "CARLOS H., Streamer",
      rating: 5,
      rotation: 8,
      variant: "secondary"
    },
    {
      text: "Lana premium y un agarre bestial al suelo. Se nota que cada puntada está hecha a mano.",
      author: "ANA B., Artista Visual",
      rating: 5,
      rotation: -5,
      variant: "secondary"
    }
  ];

  return (
    <section className={styles.infoWrapper}>
      
      {/* Background visual noise */}
      <svg width="0" height="0" style={{ position: 'absolute', zIndex: -1 }}>
        <filter id="tuftingBg">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className={styles.infoContainer}>
        
        {/* 1. INTRO: EL CONCEPTO (Texto justo, diseño agresivo) */}
        <section className={styles.introBlock}>
            <div className={styles.introLeft}>
                <div className={styles.badgeGlow}>CALIDAD SUPERIOR</div>
                <h2 className={styles.popTitle}>ES ARTE.<br/>SE PISA.</h2>
                <p className={styles.introText}>
                    Hygge Rug no es una fábrica en cadena. Detrás de esta marca hay un único creador en Madrid confeccionando arte directamente sobre lienzo. Cada alfombra (*Tufting Rug*) está construida a mano exclusivamente por mí, utilizando lana técnica de colores vibrantes y acabados tridimensionales.
                </p>
                <p className={styles.introText}>
                    Desde paneles de <strong>Anime y Manga</strong> o explosiones de estética <strong>Y2K y Retro</strong>, hasta <strong>arte abstracto</strong>, botánica o el logo de tu empresa. Ya sea decorando con piezas de nuestro catálogo o encargándonos una alfombra silueteada (Custom Order) irrompible, te llevas una pieza 1 de 1.
                </p>
            </div>
            <div className={styles.introRight}>
                {/* TIKTOK PHONE MOCKUP */}
                <div className={styles.phoneMockup}>
                    <div className={styles.phoneNotch}></div>
                    <video 
                        className={styles.phoneVideo}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        controls
                        poster="/rug-gorillaz.png"
                    >
                        {/* Se debe colocar un archivo mp4 real de un tik tok en public/ y descomentar la línea de abajo */}
                        {/* <source src="/tufting-tiktok.mp4" type="video/mp4" /> */}
                    </video>
                    <div className={styles.tiktokOverlay}>
                        <a href="https://www.tiktok.com/@hygge_rug" target="_blank" rel="noopener noreferrer" className={styles.tiktokBadge}>
                            @HYGGE_RUG en TikTok
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/* 2. THE PROCESS */}
        <section className={styles.processSection}>
          <div className={styles.sectionHeader}>
            <h3>CÓMO FUNCIONA EL ROLLO</h3>
          </div>
          <div className={styles.processGrid}>
            {processSteps.map((step, index) => (
              <ProcessCard key={index} {...step} />
            ))}
          </div>
        </section>

        {/* 3. MODO IA (Secundario pero con mucho estilo) */}
        <section className={styles.aiBanner}>
           <div className={styles.aiBannerText}>
              <span className={styles.aiNeonTitle}>LABORATORIO I.A.</span>
              <h3>¿No encuentras lo que buscas en el Catálogo?</h3>
              <p>Si tienes una paranoia extrema para tu alfombra, usa el motor de Inteligencia Artificial. Describe tu idea y la I.A. escupirá un boceto salvaje listo para que yo lo borde a mano en mi taller.</p>
           </div>
           <div className={styles.aiBannerAction}>
               <PrimaryButton text="ENTRAR AL STUDIO IA" url="/crear-diseno" className={styles.aiBtnExtra} />
           </div>
        </section>

        {/* 4. HYGGE GANG (Reseñas) */}
        <section className={styles.gangSection}>
          <div className={styles.sectionHeaderCenter}>
            <h3 className={styles.gangTitle}>HYGGE GANG</h3>
            <p>La gente de la calle ya tiene la suya.</p>
          </div>
          <div className={styles.gangGrid}>
            {testimonials.map((testimonial, index) => (
              <ReviewSticker key={index} {...testimonial} />
            ))}
          </div>
        </section>

      </div>
    </section>
  );
}

export default InfoSection;
