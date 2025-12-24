import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Image,
  Lightbulb,
  BarChart3,
  Palette,
  Bot,
  TrendingUp,
  Eye,
  ThumbsUp,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const quickActions = [
  {
    name: 'Generate Thumbnail',
    description: 'Create high-CTR thumbnails',
    icon: Image,
    href: '/dashboard/thumbnail',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Get Video Ideas',
    description: 'Viral content suggestions',
    icon: Lightbulb,
    href: '/dashboard/ideas',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'Analyze Content',
    description: 'SEO & CTR analysis',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'AI Assistant',
    description: 'Get personalized help',
    icon: Bot,
    href: '/dashboard/chat',
    color: 'from-purple-500 to-pink-500',
  },
];

const stats = [
  { label: 'Thumbnails Created', value: '24', icon: Image, change: '+12%' },
  { label: 'Ideas Generated', value: '156', icon: Lightbulb, change: '+8%' },
  { label: 'Content Analyzed', value: '18', icon: BarChart3, change: '+25%' },
  { label: 'Avg CTR Improvement', value: '+45%', icon: TrendingUp, change: '' },
];

const recentActivity = [
  { type: 'thumbnail', title: 'Gaming Thumbnail', time: '2 hours ago' },
  { type: 'idea', title: '5 Video Ideas for Tech Niche', time: '5 hours ago' },
  { type: 'analysis', title: 'SEO Analysis - Cooking Video', time: 'Yesterday' },
  { type: 'branding', title: 'Channel Name Suggestions', time: '2 days ago' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-8 glass glow-primary"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome back</span>
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Ready to create some amazing content? Your AI-powered creator tools are ready to help you grow faster.
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={action.href}>
                <Card className="group cursor-pointer hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.name}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4">Your Stats</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    {stat.change && (
                      <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-display font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {activity.type === 'thumbnail' && <Image className="w-5 h-5 text-primary" />}
                      {activity.type === 'idea' && <Lightbulb className="w-5 h-5 text-primary" />}
                      {activity.type === 'analysis' && <BarChart3 className="w-5 h-5 text-primary" />}
                      {activity.type === 'branding' && <Palette className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <h4 className="font-semibold mb-2">Boost Your CTR</h4>
                  <p className="text-sm text-muted-foreground">
                    Use faces with strong emotions in your thumbnails. Studies show faces can increase CTR by up to 38%.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                  <h4 className="font-semibold mb-2">Perfect Title Length</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep your video titles under 60 characters for maximum visibility in search and suggested videos.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-pink/5 border border-pink/10">
                  <h4 className="font-semibold mb-2">Hook in 5 Seconds</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our AI to generate powerful hooks that capture attention in the first 5 seconds of your video.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
