"use client"; 

import IntroOverlay from '@/components/ui/IntroOverlay/IntroOverlay';
import HeroSection from '@/components/sections/HeroSection/HeroSection';
import InfoSection from '@/components/sections/InfoSection/InfoSection';

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <HeroSection />
      <InfoSection />
    </>
  );
}
