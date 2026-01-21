// src/app/layout.js
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import ThemeToggle from '../components/ThemeSwitch/ThemeToggle';
import Hero from '../components/Hero/Hero'
import Footer from '../components/Footer/Footer';
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
          <ThemeToggle />
          <Hero />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}