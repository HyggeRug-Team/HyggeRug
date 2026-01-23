"use client"; 

import IntroOverlay from '@/components/IntroOverlay/IntroOverlay';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer'; 
import HeroSection from '@/components/HeroSection/HeroSection';
import InfoSection from '@/components/InfoSection/InfoSection';

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <Header />
      <HeroSection />
      <InfoSection />
      <Footer />
    </>
  );
}