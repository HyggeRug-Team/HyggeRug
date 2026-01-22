import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import ThemeToggle from '@/components/ThemeSwitch/ThemeToggle';
import Footer from '../components/Footer/Footer';
import IntroOverlay from '../components/IntroOverlay/IntroOverlay'; // <--- Importar

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: "Hygge Rug",
  description: "Alfombras de diseño",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="mainLayout">
        
        {/* 1. La Intro va PRIMERO y fuera de todo */}
        <IntroOverlay />

        {/* 2. El contenido de la web se carga "debajo" visualmente */}
        <Header />
        <ThemeToggle/>
        
        <main>
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}