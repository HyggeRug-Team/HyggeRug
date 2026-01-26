import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// Importa tus componentes existentes
import SilkBackground from '@/components/SilkBackground/SilkBackground';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="mainLayout">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}