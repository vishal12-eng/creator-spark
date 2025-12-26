import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setVideoLoaded(true));
      video.addEventListener('error', () => setVideoError(true));
    }
    return () => {
      if (video) {
        video.removeEventListener('loadeddata', () => setVideoLoaded(true));
        video.removeEventListener('error', () => setVideoError(true));
      }
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0A0F1A]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Fallback gradient background */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-[#0A0F1A] via-[#0D1220] to-[#0A0F1A] transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Simulated lava glow effect for fallback */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[40%] bg-gradient-radial from-orange-600/20 via-orange-900/10 to-transparent blur-3xl" />
        </div>

        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
          }`}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230A0F1A' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source
            src="https://res.cloudinary.com/dtmi8vdmk/video/upload/v1766748247/Cinematic_slowmotion_scene_1080p_2025122615_ve3tom.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[rgba(10,15,26,0.35)]" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0F1A] to-transparent" />
      </div>

      {/* Main Content - Static on top of video */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Centered Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <h1 className="font-display font-extralight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-[1.1] tracking-[0.08em] uppercase">
              <span className="block gradient-text text-glow-subtle">TURN THOUGHTS</span>
              <span className="block gradient-text text-glow-subtle mt-2">INTO IMPACT</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[hsla(210,20%,90%,0.8)] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-4 font-light tracking-wide leading-relaxed">
              Echoform AI helps creators turn ideas into videos, brands,
              and content that lasts.
            </p>

            {/* Footer line */}
            <p className="text-[hsla(210,20%,90%,0.5)] text-sm md:text-base font-light tracking-wider">
              Built for creators who think deeper — powered by AI.
            </p>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12">
          <div className="glass-card rounded-2xl p-5 sm:p-6 max-w-xs">
            {/* Primary CTA Button */}
            <Link to="/auth?mode=signup">
              <button className="btn-cta w-full py-3.5 px-6 rounded-xl text-white font-medium text-sm tracking-wide transition-all duration-300">
                Start Creating
              </button>
            </Link>

            {/* Secondary Link */}
            <Link 
              to="#features" 
              className="flex items-center justify-center gap-2 mt-4 text-[hsla(210,20%,90%,0.7)] hover:text-[hsla(210,20%,90%,0.95)] text-sm font-light tracking-wide transition-colors duration-300 group"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-6 h-10 rounded-full border border-[hsla(210,20%,90%,0.2)] flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-[hsla(199,89%,70%,0.6)] animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};