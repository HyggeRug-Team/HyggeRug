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
 * 3. Fondo Global Persistente (SilkBackground): Capa fija con textura oscura y profunda.
 *    Al colocarlo aquí, el fondo nunca se interrumpe al navegar entre páginas.
 *
 * [Por qué lo hemos hecho así]
 * Centralizar fuentes, metadatos y fondo global aquí evita repetir código y asegura
 * una experiencia visual consistente en toda la aplicación.
 */
import { Plus_Jakarta_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

import SilkBackground from '@/components/layout/SilkBackground/SilkBackgroundWrapper';
import GlobalBackgroundText from '@/components/layout/GlobalBackgroundText/GlobalBackgroundText';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

const rubik = localFont({
  src: [
    {
      path: '../../public/fonts/Rubik-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Rubik-Italic-VariableFont_wght.ttf',
      style: 'italic',
    }
  ],
  variable: '--font-rubik',
  display: 'swap',
});

const rubikBubbles = localFont({
  src: '../../public/fonts/RubikBubbles-Regular.ttf',
  variable: '--font-rubik-bubbles',
  weight: '400',
  style: 'normal',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Hygge Rug | Alfombras Artesanales de Tufting en Madrid',
    template: '%s | Hygge Rug'
  },
  description: 'Taller de alfombras artesanales en Madrid. Especialistas en tufting hand-made, diseños personalizados y creación con IA. Arte textil urbano para tu hogar.',
  keywords: ['tufting', 'alfombras personalizadas', 'Madrid', 'artesanía', 'decoración urbana', 'Hygge Rug', 'regalos originales', 'arte textil'],
  icons: {
    icon: '/Hygge_logo.png', 
    apple: '/Hygge_logo.png',
  },
  openGraph: {
    title: 'Hygge Rug | Alfombras Artesanales',
    description: 'Transformamos hilos en sensaciones. Alfombras únicas hechas a mano en Madrid.',
    url: 'https://hyggerug.com',
    siteName: 'Hygge Rug',
    locale: 'es_ES',
    type: 'website',
  },
};

import { CartProvider } from '@/context/CartContext';
import { CookiesProvider } from '@/context/CookiesContext';
import NotificationListener from '@/components/dashboard/NotificationListener/NotificationListener';
import CookiesBanner from '@/components/ui/Banners/CookiesBanner/CookiesBanner';

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${rubik.variable} ${rubikBubbles.variable}`}
    >
      <body>
        <CookiesProvider>
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
            <CartProvider>
              <NotificationListener />
              {children}
            </CartProvider>
            <SpeedInsights/>
          </main>

          <CookiesBanner />
        </CookiesProvider>
      </body>
    </html>
  );
}



