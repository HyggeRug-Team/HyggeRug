// src/app/layout.js
import { Plus_Jakarta_Sans } from 'next/font/google';
import Footer from '../components/Footer/Footer';
import ThemeToggle from '../components/ThemeSwitch/ThemeToggle';
import './globals.css';
import Header from '@/components/Header/Header';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="mainLayout">
        <Header/>
        <main>
          {children}
          <ThemeToggle />
        </main>
        <Footer />
      </body>
    </html>
  );
}