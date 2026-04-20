"use client";
import React from "react";
import styles from "./HeroSection.module.css";
import Image from "next/image";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";

function HeroSection({ customCards }) {
  const defaultCards = [
    { id: 1, src: "/rug-gorillaz.png", label: "Gorillaz", title: "LANZAMIENTO #01", rot: -8 },
    { id: 2, src: "/rug-shield.png", label: "Shield", title: "EXCLUSIVO", rot: -4 },
    { id: 3, src: "/rug-julieta.png", label: "Flower", title: "MÁS VENDIDO", rot: 1 },
    { id: 4, src: "/modern-detail.png", label: "Detail", title: "HECHO", rot: 4 },
    { id: 5, src: "/rug-irene.png", label: "Irene", title: "ARTE URBANO", rot: 8 },
    { id: 6, src: "/rug-mario.png", label: "Mario", title: "LIMITADO", rot: 12 },
    { id: 7, src: "/rug-shield.png", label: "Shield 2", title: "NUEVO LANZAMIENTO", rot: 15 },
  ];

  const rotations = [-8, -4, 1, 4, 8, 12, 15];

  const cardsToRender = customCards && customCards.length > 0
    ? customCards.map((c, i) => ({
        id: c.product_id,
        src: c.image_url,
        label: c.name,
        title: c.promo_title || "DESTACADO",
        rot: rotations[i % rotations.length]
      }))
    : defaultCards;

  return (
    <div className={styles.heroWrapper} id="inicio">
      
      <svg width="0" height="0" style={{ position: 'absolute', zIndex: -1 }}>
        <filter id="tuftingBg">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="tuftingShadow">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noiseShadow" />
          <feDisplacementMap in="SourceGraphic" in2="noiseShadow" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className={styles.heroContainer}>
        
        <div className={styles.heroHeader}>
          <div className={styles.badge}>HYGGE RUG COLLECTIVE</div>
          <h1 className={styles.mainTitle}>VISTE TU PISO<br/>CON ACTITUD</h1>
          <p className={styles.heroIntro}>
            Diseñamos piezas que rompen moldes. Desde nuestras cápsulas limitadas hasta tu creatividad más salvaje. 
          </p>
          <div className={styles.ctaRow}>
             <PrimaryButton text="EXPLORAR TIENDA" url="/tienda" />
             
             {/* REDESIGNED AI LINK: AI Sticker / Cyber Badge */}
             <div className={styles.aiStickerWrapper}>
                <a href="/crear-diseno" className={styles.aiStickerLink}>
                   <span className={styles.aiSpark}>✦</span>
                   <div className={styles.aiTextContainer}>
                      <span className={styles.aiOverTitle}>NUEVA FUNCIÓN</span>
                      <span className={styles.aiMainLabel}>DISEÑAR CON IA</span>
                   </div>
                </a>
             </div>
          </div>
        </div>

        {/* 7-CARD EXHIBITION */}
        <div className={styles.cardsRow}>
            {cardsToRender.map((card, i) => (
               <div 
                 key={card.id} 
                 className={styles.grungeCardWrapper}
                 style={{ 
                    transform: `rotate(${card.rot}deg)`, 
                    zIndex: 10 + i 
                 }}
               >
                  <div className={styles.tuftingShadowBox}></div>
                  <div className={styles.tuftingBgBox}></div>

                  <div className={styles.grungeCardContent}>
                      <div className={styles.grungeImageWrapper}>
                          <Image 
                            src={card.src} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            alt={card.label}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                         <div className={styles.blackTitleBox}>
                             <p className={styles.grungeTitle}>{card.title}</p>
                         </div>
                      </div>
                  </div>
               </div>
            ))}
        </div>

      </div>
    </div>
  )
}

export default HeroSection;
