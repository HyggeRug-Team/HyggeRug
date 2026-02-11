import dynamic from 'next/dynamic';
import { Plus_Jakarta_Sans, Rubik, Rubik_Bubbles } from 'next/font/google';
import './globals.css';

// Aquí configuramos la carga dinámica para que la web vuele desde el primer segundo
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

export const metadata = {
  title: 'Hygge Rug | Alfombras Artesanales',
  description: 'Alfombras artesanales hechas a mano con diseño único',
};

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
