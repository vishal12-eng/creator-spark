import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-pink/10" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Floating Orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 rounded-3xl glass glow-intense"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to <span className="gradient-text">10x Your Growth?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Join 50,000+ creators who are using AI to create better content, 
            get more views, and grow their channels faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="group">
                <Zap className="w-5 h-5" />
                Start Creating Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="glass" size="xl">
                Watch Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  );
};
