import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#0a0e17] to-deep-navy" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-purple/10 rounded-full blur-[200px]" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-ice-blue/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ice-blue/10 to-electric-purple/10 border border-white/[0.05] flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-8 h-8 text-ice-blue" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-white/95 mb-6 tracking-tight">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice-blue via-white to-ice-blue">
              Transform
            </span>{' '}
            Your Content?
          </h2>

          <p className="text-xl text-white/50 font-light mb-12 max-w-2xl mx-auto">
            Join thousands of creators who are using AI to grow faster, create smarter, and dominate their niche.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button className="h-14 px-10 bg-gradient-to-r from-electric-purple to-ice-blue text-white font-medium tracking-wide hover:opacity-90 transition-all duration-300 text-lg">
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="#features">
              <Button 
                variant="ghost" 
                className="h-14 px-8 text-white/60 hover:text-white hover:bg-white/5 font-light tracking-wide text-lg"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-10 text-white/30 text-sm font-light">
            No credit card required · Free plan available · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};
