import dynamic from 'next/dynamic';
import { Plus_Jakarta_Sans, Rubik, Rubik_Bubbles } from 'next/font/google';
import './globals.css';

import SilkBackground from '@/components/layout/SilkBackground/SilkBackgroundWrapper';
import KineticBackground from '@/components/layout/KineticBackground/KineticBackground'; // Importamos el fondo cinético

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
      className={`${plusJakartaSans.variable} ${rubik.variable} ${rubikBubbles.variable}`}
    >
      <body>
        {/* Fondo Global de la Aplicación */}
        <div style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: -10, 
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, #1A1A1A 0%, #1E2024 40%, #151515 100%)' // Degradado Tufting fallback
        }}>
            <SilkBackground />
            <KineticBackground />
        </div>
            
        {/* Contenido Principal */}
        <main style={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          display: 'flex',     
          flexDirection: 'column',
          minHeight: '100vh',
          overflowX: 'hidden' // Mantenemos para seguridad
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}



