import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Building, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Stripe price IDs for each plan
const PRICE_IDS = {
  creator: 'price_1RXRvzBZ3oHGezWnGQvfDK4L',
  pro: 'price_1RXRxnBZ3oHGezWnJPLQHiB7',
};

const plans = [
  {
    name: 'Free',
    key: 'free',
    icon: Zap,
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out CreatorAI',
    features: [
      '20 tokens/month',
      'Watermarked thumbnails',
      'Basic video ideas',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Creator',
    key: 'creator',
    icon: Crown,
    price: '$9',
    period: '/month',
    description: 'For growing creators who want more',
    features: [
      '500 tokens/month',
      'HD thumbnails (no watermark)',
      'Advanced video ideas',
      'AI chat assistant',
      'Channel branding tools',
      'Priority support',
    ],
    cta: 'Start Creator Plan',
    popular: true,
  },
  {
    name: 'Pro',
    key: 'pro',
    icon: Building,
    price: '$29',
    period: '/month',
    description: 'For professional creators',
    features: [
      '2000 tokens/month',
      'Everything in Creator',
      'Advanced analytics',
      'API access',
      'Dedicated support',
      'Custom AI training',
    ],
    cta: 'Start Pro Plan',
    popular: false,
  },
];

export const PricingSection: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanClick = async (planKey: string) => {
    // Free plan - just go to signup
    if (planKey === 'free') {
      navigate('/auth?mode=signup');
      return;
    }

    // If not logged in, redirect to auth
    if (!user || !session) {
      navigate('/auth?mode=signup');
      return;
    }

    // Get the price ID for the selected plan
    const priceId = PRICE_IDS[planKey as keyof typeof PRICE_IDS];
    if (!priceId) {
      toast({
        title: 'Error',
        description: 'Invalid plan selected',
        variant: 'destructive',
      });
      return;
    }

    setLoadingPlan(planKey);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

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
                <Button
                  onClick={() => handlePlanClick(plan.key)}
                  disabled={loadingPlan === plan.key}
                  className={`w-full h-12 font-medium tracking-wide transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-electric-purple to-ice-blue text-white hover:opacity-90 border-0'
                      : 'bg-transparent border border-white/20 text-white/80 hover:border-ice-blue/50 hover:text-white'
                  }`}
                  size="lg"
                >
                  {loadingPlan === plan.key ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    plan.cta
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
