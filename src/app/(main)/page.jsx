import HeroSection from '@/components/sections/HeroSection/HeroSection';
import MarqueeStrip from '@/components/sections/MarqueeStrip/MarqueeStrip';
import FeaturedDrops from '@/components/sections/FeaturedDrops/FeaturedDrops';
import InfoSection from '@/components/sections/InfoSection/InfoSection';
import FunnyNotification from '@/components/ui/FunnyNotification/FunnyNotification';
import { getRandomProducts } from '@/lib/db/products';

export const metadata = {
  title: 'Inicio | Alfombras Personalizadas y Tufting Art',
  description: 'Descubre Hygge Rug, tu taller de alfombras artesanales en Madrid. Explora diseños de la comunidad o crea tu propia alfombra personalizada con IA y tufting hecho a mano.',
  keywords: 'tufting, alfombras personalizadas, artesania Madrid, decoración urbana, alfombras IA, handmade rugs'
};

/**
 * @file page.jsx (Home)
 * @description La cara visible de Hygge Rug.
 *
 * [Nuestro enfoque]
 * Construimos la home como un escaparate dinámico. Inyectamos productos reales en 
 * el hero y activamos un "Easter Egg" humorístico para conectar con el usuario.
 *
 * [Por qué lo hemos hecho así]
 * Al usar SSR (Server Side Rendering) para los productos aleatorios, garantizamos 
 * que la página cargue rápido pero con contenido siempre fresco en cada visita.
 */
export default async function Home() {
  const customCards = await getRandomProducts(7);

  return (
    <>
      <HeroSection customCards={customCards} />
      <MarqueeStrip />
      <FeaturedDrops />
      <InfoSection />
      <FunnyNotification products={customCards} />
    </>
  );
}
