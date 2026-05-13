/**
 * @file page.jsx (Home)
 * @description La cara visible de Hygge Rug: nuestra puerta de entrada.
 *
 * [Nuestro enfoque]
 * Hemos construido la página principal como un escaparate dinámico y vivo. 
 * Combinamos el impacto visual del Hero con secciones que inyectan productos 
 * reales de la comunidad, asegurando que el taller siempre se sienta activo.
 *
 * [Por qué lo hemos hecho así]
 * Al utilizar Server Components para obtener productos y reseñas, garantizamos 
 * una velocidad de carga óptima mientras mantenemos el contenido fresco en 
 * cada visita, algo fundamental para nuestro posicionamiento y la confianza del usuario.
 */
import HeroSection from '@/components/sections/HeroSection/HeroSection';
import MarqueeStrip from '@/components/sections/MarqueeStrip/MarqueeStrip';
import FeaturedDrops from '@/components/sections/FeaturedDrops/FeaturedDrops';
import InfoSection from '@/components/sections/InfoSection/InfoSection';
import FunnyNotification from '@/components/ui/FunnyNotification/FunnyNotification';
import { getRandomProducts } from '@/lib/db/products';
import { getRandomReviews } from '@/lib/db/reviews';
import { getConfigValues } from '@/lib/db/config';

export const metadata = {
  title: 'Inicio | Alfombras Personalizadas y Tufting Art',
  description: 'Descubre Hygge Rug, tu taller de alfombras artesanales en Madrid. Explora diseños de la comunidad o crea tu propia alfombra personalizada con IA y tufting hecho a mano.',
  keywords: 'tufting, alfombras personalizadas, artesania Madrid, decoración urbana, alfombras IA, handmade rugs'
};

export default async function Home() {
  const [customCards, reviews, config] = await Promise.all([
    getRandomProducts(7),
    getRandomReviews(3),
    getConfigValues(['tiktok_video_url', 'tiktok_handle', 'social_tiktok'])
  ]);

  return (
    <>
      <HeroSection customCards={customCards} />
      <MarqueeStrip />
      <FeaturedDrops />
      <InfoSection 
        testimonials={reviews} 
        videoUrl={config.tiktok_video_url} 
        tiktokHandle={config.tiktok_handle}
        tiktokUrl={config.social_tiktok}
      />
      <FunnyNotification products={customCards} />
    </>
  );
}
