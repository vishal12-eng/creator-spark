import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Building } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: 'Free',
    period: '',
    description: 'Perfect for trying out CreatorAI',
    features: [
      '5 thumbnails/month',
      '10 video ideas/month',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '$19',
    period: '/month',
    description: 'For growing creators who want more',
    features: [
      'Unlimited thumbnails',
      'Unlimited video ideas',
      'Advanced analytics',
      'AI chat assistant',
      'Channel branding tools',
      'Priority support',
      'API access',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Agency',
    icon: Building,
    price: '$99',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      '10 team members',
      'White-label exports',
      'Custom AI training',
      'Dedicated support',
      'Advanced API access',
      'Analytics dashboard',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-deep-navy" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#080b12] to-deep-navy" />
      
      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-electric-purple/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-ice-blue/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Pricing
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-white/95 mb-6 tracking-tight"
          >
            Simple,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice-blue via-white to-ice-blue">
              Transparent
            </span>{' '}
            Pricing
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto font-light"
          >
            Choose the perfect plan for your content creation journey. 
            Upgrade or downgrade anytime.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`relative group ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-5 py-2 rounded-full bg-gradient-to-r from-electric-purple to-ice-blue text-white text-sm font-medium tracking-wider">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`relative p-8 lg:p-10 rounded-2xl h-full flex flex-col ${
                plan.popular
                  ? 'bg-white/[0.04] border-2 border-ice-blue/30'
                  : 'bg-white/[0.02] border border-white/[0.05]'
              } backdrop-blur-sm hover:border-ice-blue/20 transition-all duration-500`}>
                
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-electric-purple to-ice-blue' 
                      : 'bg-white/[0.05] border border-white/[0.05]'
                  } flex items-center justify-center mx-auto mb-5`}>
                    <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-ice-blue'}`} />
                  </div>
                  <h3 className="text-2xl font-display font-medium text-white/90 mb-2">{plan.name}</h3>
                  <p className="text-white/40 text-sm font-light">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <span className="text-5xl font-display font-light text-white">{plan.price}</span>
                  <span className="text-white/40 font-light">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-ice-blue/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-ice-blue" />
                      </div>
                      <span className="text-sm text-white/60 font-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/auth?mode=signup" className="block">
                  <Button
                    className={`w-full h-12 font-medium tracking-wide transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-electric-purple to-ice-blue text-white hover:opacity-90 border-0'
                        : 'bg-transparent border border-white/20 text-white/80 hover:border-ice-blue/50 hover:text-white'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
