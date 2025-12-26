import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Input Your Content',
    description: 'Enter your video title, niche, and style preferences. Upload a reference image or let AI create from scratch.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Magic Happens',
    description: 'Our advanced AI analyzes millions of high-performing thumbnails and generates optimized designs for maximum CTR.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download & Publish',
    description: 'Get your ready-to-use thumbnail, video ideas, scripts, and SEO content. Download and start growing!',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#0a0e17] to-deep-navy" />
      
      {/* Horizontal line accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ice-blue/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ice-blue/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-ice-blue/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Simple Process
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-white/95 mb-6 tracking-tight"
          >
            How It{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice-blue via-white to-ice-blue">
              Works
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto font-light"
          >
            Get started in seconds. Our AI does the heavy lifting so you can focus on creating great content.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-ice-blue/30 to-transparent -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="relative p-10 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] text-center group hover:border-ice-blue/20 transition-all duration-500">
                  {/* Step Number */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div className="px-5 py-2 rounded-full bg-gradient-to-r from-electric-purple to-ice-blue text-white text-sm font-medium tracking-wider">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ice-blue/10 to-electric-purple/10 border border-white/[0.05] flex items-center justify-center mx-auto mb-8 mt-4 group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-10 h-10 text-ice-blue" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-display font-medium text-white/90 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-white/40 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
