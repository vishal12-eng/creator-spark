import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, X, Zap, Crown, Building, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Stripe price IDs for each plan
const PRICE_IDS = {
  creator: 'price_1Sl5A5Gxadm9TBllaFi2usk0',
  pro: 'price_1Sl5BQGxadm9TBlltlRwdI9m',
};

// Feature matrix for display
const featureMatrix = [
  { name: 'Monthly Tokens', free: '20', creator: '500', pro: '2,000' },
  { name: 'Idea Generation', free: true, creator: true, pro: true },
  { name: 'Hook Generator', free: 'limited', creator: true, pro: true },
  { name: 'Short Scripts', free: 'limited', creator: true, pro: true },
  { name: 'Long Scripts', free: false, creator: true, pro: true },
  { name: 'Image Generation', free: 'watermarked', creator: true, pro: true },
  { name: 'Thumbnail Prompts', free: false, creator: true, pro: true },
  { name: 'Brand Profile', free: false, creator: '1', pro: 'Multiple' },
  { name: 'AI Chat Assistant', free: 'limited', creator: true, pro: true },
  { name: 'Advanced Video Scripting', free: false, creator: false, pro: true },
  { name: 'Content Calendar', free: false, creator: false, pro: true },
  { name: 'Batch Generation', free: false, creator: false, pro: true },
  { name: 'Multi-language Support', free: false, creator: false, pro: true },
  { name: 'Priority Generation', free: false, creator: false, pro: true },
  { name: 'Generation Speed', free: 'Standard', creator: 'Normal', pro: 'Fast' },
];

const plans = [
  {
    name: 'Free',
    key: 'free',
    planId: 'FREE',
    icon: Zap,
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out CreatorAI',
    features: [
      '20 tokens/month',
      'Watermarked thumbnails',
      'Basic video ideas',
      'Limited scripts',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Creator',
    key: 'creator',
    planId: 'CREATOR',
    icon: Crown,
    price: '$9',
    period: '/month',
    description: 'For growing creators who want more',
    features: [
      '500 tokens/month',
      'HD thumbnails (no watermark)',
      'Full video ideas & scripts',
      'AI chat assistant',
      '1 brand profile',
      'Priority support',
    ],
    cta: 'Start Creator Plan',
    popular: true,
  },
  {
    name: 'Pro',
    key: 'pro',
    planId: 'PRO',
    icon: Building,
    price: '$29',
    period: '/month',
    description: 'For professional creators & agencies',
    features: [
      '2,000 tokens/month',
      'Everything in Creator',
      'Advanced video scripting',
      'Content calendar & scheduling',
      'Batch generation',
      'Multi-language support',
      'Priority generation (fast)',
      'Multiple brand profiles',
    ],
    cta: 'Start Pro Plan',
    popular: false,
  },
];

export const PricingSection: React.FC = () => {
  const { user, session, subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlan = subscription?.plan || 'FREE';

  const getButtonState = (planKey: string, planId: string) => {
    if (planId === currentPlan) {
      return { text: 'Current Plan', disabled: true, variant: 'outline' as const };
    }
    
    const planOrder = { FREE: 0, CREATOR: 1, PRO: 2 };
    const isUpgrade = planOrder[planId as keyof typeof planOrder] > planOrder[currentPlan as keyof typeof planOrder];
    
    if (planKey === 'free') {
      return { text: 'Get Started', disabled: false, variant: 'outline' as const };
    }
    
    return {
      text: isUpgrade ? `Upgrade to ${planKey.charAt(0).toUpperCase() + planKey.slice(1)}` : 'Downgrade',
      disabled: false,
      variant: isUpgrade ? 'default' as const : 'outline' as const,
    };
  };

  const handlePlanClick = async (planKey: string) => {
    if (planKey === 'free') {
      navigate('/auth?mode=signup');
      return;
    }

    if (!user || !session) {
      navigate('/auth?mode=signup');
      return;
    }

    const priceId = PRICE_IDS[planKey as keyof typeof PRICE_IDS];
    if (!priceId) {
      toast({ title: 'Error', description: 'Invalid plan selected', variant: 'destructive' });
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
      <div className="absolute inset-0 bg-deep-navy" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#080b12] to-deep-navy" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-electric-purple/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-ice-blue/70 text-sm tracking-[0.3em] uppercase mb-4">
            Pricing
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-white/95 mb-6 tracking-tight">
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice-blue via-white to-ice-blue">Transparent</span> Pricing
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-white/50 max-w-2xl mx-auto font-light">
            Choose the perfect plan for your content creation journey. Upgrade or downgrade anytime.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.planId === currentPlan;
            const buttonState = getButtonState(plan.key, plan.planId);
            
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.6 }} className={`relative group ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-5 py-2 rounded-full bg-gradient-to-r from-electric-purple to-ice-blue text-white text-sm font-medium tracking-wider">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-5 right-4 z-10">
                    <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                      Your Plan
                    </div>
                  </div>
                )}

                <div className={`relative p-8 lg:p-10 rounded-2xl h-full flex flex-col ${
                  isCurrentPlan ? 'bg-white/[0.06] border-2 border-green-500/40' :
                  plan.popular ? 'bg-white/[0.04] border-2 border-ice-blue/30' : 'bg-white/[0.02] border border-white/[0.05]'
                } backdrop-blur-sm hover:border-ice-blue/20 transition-all duration-500`}>
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-2xl ${plan.popular ? 'bg-gradient-to-br from-electric-purple to-ice-blue' : 'bg-white/[0.05] border border-white/[0.05]'} flex items-center justify-center mx-auto mb-5`}>
                      <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-ice-blue'}`} />
                    </div>
                    <h3 className="text-2xl font-display font-medium text-white/90 mb-2">{plan.name}</h3>
                    <p className="text-white/40 text-sm font-light">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <span className="text-5xl font-display font-light text-white">{plan.price}</span>
                    <span className="text-white/40 font-light">{plan.period}</span>
                  </div>

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

                  <Button
                    onClick={() => handlePlanClick(plan.key)}
                    disabled={buttonState.disabled || loadingPlan === plan.key}
                    className={`w-full h-12 font-medium tracking-wide transition-all duration-300 ${
                      isCurrentPlan ? 'bg-green-500/20 border-green-500/30 text-green-400 cursor-not-allowed' :
                      plan.popular ? 'bg-gradient-to-r from-electric-purple to-ice-blue text-white hover:opacity-90 border-0' :
                      'bg-transparent border border-white/20 text-white/80 hover:border-ice-blue/50 hover:text-white'
                    }`}
                    size="lg"
                  >
                    {loadingPlan === plan.key ? <Loader2 className="w-5 h-5 animate-spin" /> : buttonState.text}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
