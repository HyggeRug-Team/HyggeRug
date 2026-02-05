import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// Importa tus componentes existentes
import SilkBackground from '@/components/layout/SilkBackground/SilkBackground';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'Hygge Rug | Alfombras Artesanales',
  description: 'Alfombras artesanales hechas a mano con diseño único',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="mainLayout">
        <SilkBackground />
        {children}
      </body>
    </html>
  );
}
