/**
 * @file layout.jsx (Grupo Main)
 * @description Layout principal que provee de Navbar (Header) y Footer global a las rutas comerciales.
 * 
 * [Nuestro enfoque]
 * Hemos implementado este layout para centralizar los elementos comunes de la interfaz. 
 * Recuperamos las configuraciones globales (como redes sociales) desde la base de datos 
 * para inyectarlas directamente en el Header y Footer, asegurando que cualquier cambio 
 * administrativo se refleje en toda la web comercial.
 */
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import { getConfigValues } from '@/lib/db/config';

export default async function MainLayout({ children }) {
  const config = await getConfigValues(['social_instagram', 'social_tiktok']);

  return (
    <>
      <Header socialLinks={config} />
      <main className="main-content">
        {children}
      </main>
      <Footer socialLinks={config} />
    </>
  );
}
