import dynamic from 'next/dynamic';
import { Plus_Jakarta_Sans, Rubik, Rubik_Bubbles } from 'next/font/google';
import './globals.css';

import SilkBackground from '@/components/layout/SilkBackground/SilkBackgroundWrapper';

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

// --- MODIFICACIÓN AQUÍ ---
export const metadata = {
  title: 'Hygge Rug | Alfombras Artesanales',
  description: 'Alfombras artesanales hechas a mano con diseño único',
  icons: {
    // Asegúrate de que el nombre coincida exactamente con el archivo en tu carpeta /public
    icon: '/HeadIcon.ico', 
    apple: '/HeadIcon.ico',
  },
};
// --------------------------

export default function RootLayout({ children }) {
  return (
    <html 
      lang="es" 
      className={`${plusJakartaSans.variable} ${rubik.variable} ${rubikBubbles.variable}`}
    >
      <body>
        <SilkBackground />
        {children}
      </body>
    </html>
  );
}