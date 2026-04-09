/**
 * @file layout.js (RootLayout)
 * @description Estructura base compartida por toda la aplicación.
 *
 * [Nuestro enfoque]
 * Este archivo es el "cimiento" de nuestra web. Todo lo que pongamos aquí aparece
 * en todas las páginas, desde la página de inicio hasta el panel de usuario.
 *
 * ¿Qué funciones críticas cumple nuestro RootLayout?
 * 1. Gestión de Tipografías: Cargamos las fuentes de forma optimizada con Next.js Fonts.
 *    "Rubik Bubbles" para títulos creativos y "Rubik" para textos de cuerpo.
 * 2. SEO y Metadatos: Título, descripción e icono de pestaña para buscadores.
 * 3. Fondo Global Persistente (SilkBackground): Capa fija con textura oscura premium.
 *    Al colocarlo aquí, el fondo nunca se interrumpe al navegar entre páginas.
 *
 * [Por qué lo hemos hecho así]
 * Centralizar fuentes, metadatos y fondo global aquí evita repetir código y asegura
 * una experiencia visual consistente en toda la aplicación.
 */
import { Plus_Jakarta_Sans, Rubik, Rubik_Bubbles } from 'next/font/google';
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

import SilkBackground from '@/components/layout/SilkBackground/SilkBackgroundWrapper';
import GlobalBackgroundText from '@/components/layout/GlobalBackgroundText/GlobalBackgroundText';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
});

const rubikBubbles = Rubik_Bubbles({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-rubik-bubbles',
});

export const metadata = {
  title: 'Hygge Rug | Alfombras Artesanales',
  description: 'Alfombras artesanales hechas a mano con diseño único',
  icons: {
    icon: '/HeadIcon.ico', 
    apple: '/HeadIcon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="es"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${rubik.variable} ${rubikBubbles.variable}`}
    >
      <body>
        {/* Fondo global persistente y Textos flotantes globales fijos */}
        <SilkBackground />
        <GlobalBackgroundText />
            
        <main style={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          display: 'flex',     
          flexDirection: 'column',
          minHeight: '100vh',
          overflowX: 'hidden'
        }}>
          {children}
          <SpeedInsights/>
        </main>
      </body>
    </html>
  );
}



