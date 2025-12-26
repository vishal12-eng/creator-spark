import React from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Lightbulb, 
  BarChart3, 
  Palette, 
  Target, 
  Bot
} from 'lucide-react';

const features = [
  {
    icon: Image,
    title: 'AI Thumbnail Generator',
    description: 'Create eye-catching, high-CTR thumbnails with perfect face placement and bold text using advanced AI.',
  },
  {
    icon: Lightbulb,
    title: 'Viral Video Ideas',
    description: 'Generate trending video concepts, SEO-optimized titles, descriptions, and hooks that drive views.',
  },
  {
    icon: BarChart3,
    title: 'Content Analytics',
    description: 'Analyze your videos with AI to get actionable insights on SEO, CTR potential, and improvements.',
  },
  {
    icon: Palette,
    title: 'Channel Branding',
    description: 'Create cohesive channel branding with AI-generated names, logos, banners, and positioning.',
  },
  {
    icon: Target,
    title: 'Niche Analyzer',
    description: 'Discover low-competition niches with high growth potential across YouTube and Instagram.',
  },
  {
    icon: Bot,
    title: 'AI Chat Assistant',
    description: 'Get personalized guidance and answers about content creation, SEO, and growth strategies.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-deep-navy" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-deep-navy/95 to-deep-navy" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ice-blue/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-electric-purple/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-ice-blue/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Powerful Features
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-white/95 mb-6 tracking-tight"
          >
            Everything You Need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice-blue via-white to-ice-blue">
              Dominate Your Niche
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto font-light"
          >
            Our AI-powered tools help you create better content, optimize for discovery, 
            and grow your audience faster than ever before.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative"
            >
              {/* Card */}
              <div className="relative p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-ice-blue/20 transition-all duration-500 h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ice-blue/10 to-electric-purple/10 border border-white/[0.05] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-ice-blue" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-medium text-white/90 mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/40 font-light leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ice-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
