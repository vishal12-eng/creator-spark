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
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Choose the perfect plan for your content creation journey. 
            Upgrade or downgrade anytime.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'glass glow-primary border-primary/50'
                  : 'glass'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-bold">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-14 h-14 rounded-2xl ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary to-accent' 
                    : 'bg-muted'
                } flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className={`w-7 h-7 ${plan.popular ? 'text-white' : 'text-foreground'}`} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <span className="text-5xl font-display font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/auth?mode=signup">
                <Button
                  className="w-full"
                  variant={plan.popular ? 'premium' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
