import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Image,
  Lightbulb,
  BarChart3,
  Palette,
  Bot,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  Loader2,
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

interface Stats {
  thumbnails: number;
  ideas: number;
  chats: number;
}

interface RecentActivity {
  type: 'thumbnail' | 'idea' | 'chat';
  title: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const { user, session } = useAuth();
  const [stats, setStats] = useState<Stats>({ thumbnails: 0, ideas: 0, chats: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    try {
      // Get counts
      const [thumbResult, ideasResult, chatsResult] = await Promise.all([
        supabase.from('thumbnails').select('id', { count: 'exact', head: true }),
        supabase.from('video_ideas').select('id', { count: 'exact', head: true }),
        supabase.from('chat_messages').select('id', { count: 'exact', head: true }).eq('role', 'user'),
      ]);

      setStats({
        thumbnails: thumbResult.count || 0,
        ideas: ideasResult.count || 0,
        chats: chatsResult.count || 0,
      });

      // Get recent activity
      const activities: RecentActivity[] = [];

      const { data: recentThumbs } = await supabase
        .from('thumbnails')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      recentThumbs?.forEach(t => {
        activities.push({
          type: 'thumbnail',
          title: t.title,
          time: formatTimeAgo(new Date(t.created_at)),
        });
      });

      const { data: recentIdeas } = await supabase
        .from('video_ideas')
        .select('niche, platform, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      recentIdeas?.forEach(i => {
        activities.push({
          type: 'idea',
          title: `${i.niche} ideas for ${i.platform}`,
          time: formatTimeAgo(new Date(i.created_at)),
        });
      });

      // Sort by most recent
      activities.sort((a, b) => {
        // Simple sort - recent items first
        return 0;
      });

      setRecentActivity(activities.slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const statsDisplay = [
    { label: 'Thumbnails Created', value: stats.thumbnails.toString(), icon: Image, change: '' },
    { label: 'Ideas Generated', value: stats.ideas.toString(), icon: Lightbulb, change: '' },
    { label: 'Chat Messages', value: stats.chats.toString(), icon: Bot, change: '' },
    { label: 'AI Powered', value: '100%', icon: TrendingUp, change: '' },
  ];

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
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsDisplay.map((stat, index) => (
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
                    </div>
                    <div className="text-2xl font-display font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
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
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  No recent activity. Start creating to see your history here!
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {activity.type === 'thumbnail' && <Image className="w-5 h-5 text-primary" />}
                        {activity.type === 'idea' && <Lightbulb className="w-5 h-5 text-primary" />}
                        {activity.type === 'chat' && <Bot className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
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
                <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/10">
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
