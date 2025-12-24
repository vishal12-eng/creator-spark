import React from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Lightbulb, 
  BarChart3, 
  Palette, 
  Target, 
  Bot,
  Sparkles,
  TrendingUp,
  Hash
} from 'lucide-react';

const features = [
  {
    icon: Image,
    title: 'AI Thumbnail Generator',
    description: 'Create eye-catching, high-CTR thumbnails with perfect face placement and bold text using advanced AI.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Lightbulb,
    title: 'Viral Video Ideas',
    description: 'Generate trending video concepts, SEO-optimized titles, descriptions, and hooks that drive views.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Content Analytics',
    description: 'Analyze your videos with AI to get actionable insights on SEO, CTR potential, and improvements.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Palette,
    title: 'Channel Branding',
    description: 'Create cohesive channel branding with AI-generated names, logos, banners, and positioning.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Target,
    title: 'Niche Analyzer',
    description: 'Discover low-competition niches with high growth potential across YouTube and Instagram.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Bot,
    title: 'AI Chat Assistant',
    description: 'Get personalized guidance and answers about content creation, SEO, and growth strategies.',
    color: 'from-indigo-500 to-violet-500',
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powerful Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Everything You Need to
            <br />
            <span className="gradient-text">Dominate Your Niche</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
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
              className="group relative p-6 rounded-2xl glass hover:shadow-glow transition-all duration-300 card-hover"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid sm:grid-cols-3 gap-6"
        >
          {[
            { icon: TrendingUp, label: 'SEO Optimization', desc: 'Rank higher in search' },
            { icon: Hash, label: 'Hashtag Generator', desc: 'Maximum reach & engagement' },
            { icon: Sparkles, label: 'Script Writing', desc: 'Engaging video scripts' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl glass"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
