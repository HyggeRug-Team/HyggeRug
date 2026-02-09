import HeroSection from '@/components/sections/HeroSection/HeroSection';
import InfoSection from '@/components/sections/InfoSection/InfoSection';
import IntroOverlay from '@/components/ui/IntroOverlay/IntroOverlayWrapper';

/**
 * Aquí montamos la página principal como un Server Component.
 * Esto se encarga de que todo cargue súper rápido y esté optimizado para buscadores.
 */
export default function Home() {
  return (
    <>
      <IntroOverlay />
      <HeroSection />
      <InfoSection />
    </>
  );
}
