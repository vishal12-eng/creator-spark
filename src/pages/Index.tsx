import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ThumbnailShowcase } from '@/components/landing/ThumbnailShowcase';
import { PricingSection } from '@/components/landing/PricingSection';
import { CTASection } from '@/components/landing/CTASection';
import { SEO, FAQSchema } from '@/components/SEO';

const faqs = [
  { question: 'What is CreatorAI?', answer: 'CreatorAI is an AI-powered toolkit for YouTube creators that helps generate thumbnails, video ideas, and optimize content.' },
  { question: 'Is CreatorAI free?', answer: 'CreatorAI offers a free tier with limited features. Premium plans unlock unlimited AI generations and advanced features.' },
  { question: 'How does the thumbnail generator work?', answer: 'Our AI analyzes your video title and niche to generate eye-catching, click-worthy thumbnails optimized for YouTube.' }
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <FAQSchema faqs={faqs} />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ThumbnailShowcase />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
