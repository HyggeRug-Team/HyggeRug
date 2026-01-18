// src/app/layout.js

import { Plus_Jakarta_Sans } from 'next/font/google';
import Footer from '../components/Footer/Footer';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="mainLayout">
        {children}
        
        <Footer />
      </body>
    </html>
  );
}