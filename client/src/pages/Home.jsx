import React from 'react';
import HeroSection from '../components/home/HeroSection';
import RolesSection from '../components/home/RolesSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import StatsSection from '../components/home/StatsSection';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/common/Footer';
import '../styles/Home.css';
import '../styles/LandingSections.css';

export default function Home() {
  return (
    <div className="home-container" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <HeroSection />
      <RolesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
