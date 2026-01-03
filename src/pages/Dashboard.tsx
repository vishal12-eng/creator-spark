import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PlanBadge } from '@/components/PlanBadge';
import { TokenDisplay } from '@/components/TokenDisplay';
import { 
  Lightbulb, 
  Image, 
  BarChart3, 
  Palette, 
  Bot, 
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Layers,
  FileVideo,
  Crown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeatureAccess, type FeatureId } from '@/hooks/useFeatureAccess';

const quickActions = [
  {
    name: 'Thumbnail Generator',
    description: 'Create eye-catching thumbnails',
    icon: Image,
    href: '/dashboard/thumbnail',
    color: 'from-cyan-500 to-blue-500',
    featureId: 'image_generation' as FeatureId,
  },
  {
    name: 'Video Ideas',
    description: 'Generate viral video concepts',
    icon: Lightbulb,
    href: '/dashboard/ideas',
    color: 'from-yellow-500 to-orange-500',
    featureId: 'idea_generation' as FeatureId,
  },
  {
    name: 'Niche Analyzer',
    description: 'Find profitable niches',
    icon: Target,
    href: '/dashboard/niche',
    color: 'from-green-500 to-emerald-500',
    featureId: 'niche_analyzer' as FeatureId,
  },
  {
    name: 'Content Analytics',
    description: 'Analyze your performance',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'from-purple-500 to-violet-500',
    featureId: 'content_analytics' as FeatureId,
  },
  {
    name: 'AI Assistant',
    description: 'Get personalized advice',
    icon: Bot,
    href: '/dashboard/chat',
    color: 'from-pink-500 to-rose-500',
    featureId: 'ai_chat' as FeatureId,
  },
  {
    name: 'Channel Branding',
    description: 'Build your brand identity',
    icon: Palette,
    href: '/dashboard/branding',
    color: 'from-indigo-500 to-blue-500',
    featureId: 'brand_profile' as FeatureId,
  },
];

const proFeatures = [
  {
    name: 'Content Calendar',
    description: 'Schedule & plan content',
    icon: Calendar,
    href: '/dashboard/calendar',
    featureId: 'content_calendar' as FeatureId,
  },
  {
    name: 'Batch Generation',
    description: 'Generate content in bulk',
    icon: Layers,
    href: '/dashboard/batch',
    featureId: 'batch_generation' as FeatureId,
  },
  {
    name: 'Advanced Scripting',
    description: 'Pro video scripts',
    icon: FileVideo,
    href: '/dashboard/scripting',
    featureId: 'advanced_video_scripting' as FeatureId,
  },
];

interface Stats {
  thumbnails: number;
  ideas: number;
  chats: number;
}

interface RecentActivity {
  type: string;
  title: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const { user, subscription } = useAuth();
  const { checkFeatureAccess, currentPlan } = useFeatureAccess();
  const [stats, setStats] = useState<Stats>({ thumbnails: 0, ideas: 0, chats: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [thumbnailsRes, ideasRes, chatsRes] = await Promise.all([
        supabase.from('thumbnails').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('video_ideas').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('chat_messages').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('role', 'user'),
      ]);

      setStats({
        thumbnails: thumbnailsRes.count || 0,
        ideas: ideasRes.count || 0,
        chats: chatsRes.count || 0,
      });

      const { data: recentThumbnails } = await supabase
        .from('thumbnails')
        .select('title, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = (recentThumbnails || []).map((t) => ({
        type: 'Thumbnail',
        title: t.title,
        date: t.created_at,
      }));

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const tokensRemaining = subscription?.tokensRemaining ?? 20;
  const tokensLimit = subscription?.tokensLimit ?? 20;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">
            Welcome back, <span className="gradient-text">{user?.name || 'Creator'}</span>!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your content creation journey.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <PlanBadge plan={currentPlan} />
          <TokenDisplay compact />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const access = checkFeatureAccess(action.featureId);
            return (
              <Link key={action.name} to={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="group cursor-pointer hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                    {access.isLimited && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
                        Limited
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {action.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Pro Features Section */}
      {currentPlan !== 'PRO' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Unlock Pro Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {proFeatures.map((feature) => {
                  const access = checkFeatureAccess(feature.featureId);
                  return (
                    <Link
                      key={feature.name}
                      to={feature.href}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <feature.icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{feature.name}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                      {!access.hasAccess && (
                        <span className="ml-auto text-xs px-2 py-0.5 bg-muted rounded-full">PRO</span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <Link to="/#pricing">
                <Button variant="premium" className="w-full sm:w-auto">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Image className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                    <p className="text-2xl font-bold">{stats.thumbnails}</p>
                    <p className="text-xs text-muted-foreground">Thumbnails</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">{stats.ideas}</p>
                    <p className="text-xs text-muted-foreground">Ideas</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Bot className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                    <p className="text-2xl font-bold">{stats.chats}</p>
                    <p className="text-xs text-muted-foreground">AI Chats</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No activity yet. Start creating!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Image className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px]">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.type}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
