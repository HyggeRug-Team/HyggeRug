"use client";
import React from "react";
import styles from "./InfoSection.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import FeatureCard from "@/components/ui/Cards/FeatureCard/FeatureCard";
import TestimonialCard from "@/components/ui/Cards/TestimonialCard/TestimonialCard";
import Marquee from "@/components/ui/Marquee/Marquee";
import Timeline from "@/components/ui/Timeline/Timeline";
import CtaBanner from "@/components/ui/Banners/CtaBanner/CtaBanner";

import { 
  FaStar, FaShippingFast, FaHeart, FaRulerCombined, FaPalette, FaLeaf,
  FaCertificate, FaAward, FaCheckCircle
} from "react-icons/fa";

function InfoSection() {
  
  const features = [
    { icon: <FaPalette />, title: "Diseño Personalizado", desc: "Tu creatividad es el límite. Cualquier imagen, logo o idea" },
    { icon: <FaHeart />, title: "Hecho a Mano", desc: "Cada punto trabajado con pistola tufting profesional" },
    { icon: <FaRulerCombined />, title: "Medidas Perfectas", desc: "Desde 30x30cm hasta alfombras gigantes de salón" },
    { icon: <FaLeaf />, title: "Lana Premium", desc: "100% lana natural de Nueva Zelanda. Suave y duradera" },
    { icon: <FaShippingFast />, title: "Envío en 72h", desc: "Producción rápida sin comprometer la calidad" },
    { icon: <FaCertificate />, title: "Garantía Total", desc: "Si no te encanta, te devolvemos el dinero" },
  ];

  const processSteps = [
    { num: "01", title: "Comparte tu Idea", desc: "Envíanos tu diseño, foto o concepto. También podemos ayudarte a crearlo desde cero." },
    { num: "02", title: "Aprobación Digital", desc: "Te enviamos un boceto digital para que veas exactamente cómo quedará antes de empezar." },
    { num: "03", title: "Tufting Artesanal", desc: "Nuestro equipo trabaja cada alfombra a mano con la técnica de tufting manual." },
    { num: "04", title: "Acabado Profesional", desc: "Reforzamos, recortamos y limpiamos cada pieza para un acabado perfecto." },
    { num: "05", title: "Empaque y Envío", desc: "Empacamos con amor y enviamos directamente a tu puerta en menos de 72h." },
  ];

  const testimonials = [
    { name: "Laura M.", text: "Mi alfombra de Gorillaz quedó PERFECTA. La calidad es increíble y el equipo súper atento.", rating: 5 },
    { name: "Carlos R.", text: "Pedí una alfombra personalizada con el logo de mi empresa. Impresionante resultado.", rating: 5 },
    { name: "Ana P.", text: "La mejor compra que he hecho. Mi salón ahora tiene vida propia.", rating: 5 },
  ];

  const galleryRugs = [
    { src: "/rug-mario.png", title: "Mario Bros", style: "Videojuegos" },
    { src: "/rug-gorillaz.png", title: "Gorillaz", style: "Música" },
    { src: "/rug-julieta.png", title: "Julieta", style: "Nombres" },
    { src: "/rug-irene.png", title: "Irene", style: "Abstracto" },
    { src: "/rug-shield.png", title: "Shield", style: "Logos" },
  ];

  // Configuración de animación scroll bidireccional (Replay)
  // Configuración de animación scroll bidireccional (Replay)
  // Utilizamos will-change para optimizar el rendimiento en scroll
  const scrollAnimConfig = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.5 }, 
    transition: { duration: 0.6, ease: "easeOut" },
    style: { willChange: "opacity, transform" } 
  };

  return (
    <section className={styles.infoSection}>
      <div className={styles.container}>

        {/* --- AQUÍ CONTAMOS POR QUÉ NOS ELIGEN --- */}
        <motion.div 
          className={styles.whySection}
          {...scrollAnimConfig}
        >
          <SectionHeader 
             badge="POR QUÉ ELEGIRNOS"
             icon={FaStar}
             title={<>No somos una tienda más.<br/>Somos <span className={styles.highlight}>artesanos modernos</span></>}
             description="Combinamos la tradición del tufting artesanal con diseños contemporáneos. Cada alfombra es una pieza única que refleja tu personalidad y estilo."
             scrollAnimConfig={scrollAnimConfig}
          />

          <div className={styles.featuresGrid}>
            {features.map((feature, i) => (
              <FeatureCard 
                key={i}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                delay={i * 0.08}
              />
            ))}
          </div>
        </motion.div>

        {/* --- AQUÍ EXPLICAMOS NUESTRO PROCESO PASO A PASO --- */}
        <motion.div 
          className={styles.processSection}
          {...scrollAnimConfig}
        >
          <SectionHeader 
             badge="CÓMO FUNCIONA"
             icon={FaCheckCircle}
             title={<>Del concepto al textil<br/>en <span className={styles.highlight}>5 pasos simples</span></>}
             scrollAnimConfig={scrollAnimConfig}
          />

          <Timeline steps={processSteps} />
        </motion.div>

        {/* --- NUESTRA GALERÍA INFINITA DE INSPIRACIÓN --- */}
        <motion.div 
          className={styles.gallerySection}
          {...scrollAnimConfig}
        >
          <SectionHeader 
             badge="INSPIRACIÓN"
             icon={FaPalette}
             title={<>Lo que puedes <span className={styles.highlight}>crear</span></>}
             description="Explora posibilidades infinitas. Desde arte abstracto hasta tus personajes favoritos."
             scrollAnimConfig={scrollAnimConfig}
          />

          <Marquee>
              {/* Duplicamos las imágenes para asegurar que el scroll infinito sea suave */}
              {[...galleryRugs, ...galleryRugs, ...galleryRugs, ...galleryRugs].map((rug, i) => (
                <div key={i} className={styles.marqueeCard}>
                  <Image 
                    src={rug.src}
                    alt={rug.title}
                    width={300}
                    height={380}
                    className={styles.galleryImage}
                  />
                  <div className={styles.galleryOverlay}>
                    <span className={styles.galleryStyle}>{rug.style}</span>
                  </div>
                </div>
              ))}
          </Marquee>
        </motion.div>

        {/* --- OPINIONES DE NUESTROS CLIENTES --- */}
        <motion.div 
          className={styles.testimonialsSection}
          {...scrollAnimConfig}
        >
          <SectionHeader 
             badge="TESTIMONIOS"
             icon={FaHeart}
             title={<>Clientes <span className={styles.highlight}>felices</span></>}
             scrollAnimConfig={scrollAnimConfig}
          />

          <div className={styles.testimonialsGrid}>
            {testimonials.map((test, i) => (
               <TestimonialCard 
                  key={i}
                  name={test.name}
                  text={test.text}
                  rating={test.rating}
                  delay={i * 0.15}
               />
            ))}
          </div>
        </motion.div>

        {/* --- LLAMADA FINAL A LA ACCIÓN --- */}
        <CtaBanner 
            title="¿Listo para tu alfombra soñada?"
            text="Diseño gratuito • Envío en 72h • Garantía de satisfacción 100%"
            btnText="Empezar mi Diseño"
            btnUrl="#crear"
        />

      </div>
    </section>
  );
}

export default InfoSection;
