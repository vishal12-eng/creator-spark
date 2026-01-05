import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  Coins,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  BarChart3,
  Image,
  Lightbulb,
  Palette,
  Target,
  Bot,
  FileVideo,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TokenDisplayHeader } from '@/components/TokenDisplayHeader';

interface TokenLog {
  id: string;
  action: string;
  tokens_used: number;
  feature: string;
  created_at: string;
  metadata: unknown;
}

interface DailyUsage {
  date: string;
  total: number;
}

const featureIcons: Record<string, React.ElementType> = {
  thumbnail_generation: Image,
  video_ideas: Lightbulb,
  content_analytics: BarChart3,
  channel_branding: Palette,
  niche_analyzer: Target,
  ai_chat: Bot,
  advanced_scripting: FileVideo,
  batch_generation: Layers,
};

const featureLabels: Record<string, string> = {
  thumbnail_generation: 'Thumbnail Generator',
  video_ideas: 'Video Ideas',
  content_analytics: 'Content Analytics',
  channel_branding: 'Channel Branding',
  niche_analyzer: 'Niche Analyzer',
  ai_chat: 'AI Chat',
  advanced_scripting: 'Advanced Scripting',
  batch_generation: 'Batch Generation',
};

const TokenHistory: React.FC = () => {
  const { session, subscription } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<TokenLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');
  const [featureFilter, setFeatureFilter] = useState('all');
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);

  useEffect(() => {
    fetchLogs();
  }, [session, dateRange, featureFilter]);

  const fetchLogs = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const startDate = startOfDay(subDays(new Date(), parseInt(dateRange)));
      
      let query = supabase
        .from('token_usage_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (featureFilter !== 'all') {
        query = query.eq('feature', featureFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);

      // Calculate daily usage
      const usageByDay: Record<string, number> = {};
      (data || []).forEach((log) => {
        const day = format(new Date(log.created_at), 'yyyy-MM-dd');
        usageByDay[day] = (usageByDay[day] || 0) + log.tokens_used;
      });

      const dailyData = Object.entries(usageByDay)
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      setDailyUsage(dailyData);
    } catch (error) {
      console.error('Error fetching token logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load token history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalTokensUsed = logs.reduce((sum, log) => sum + log.tokens_used, 0);
  const maxDailyUsage = Math.max(...dailyUsage.map(d => d.total), 1);

  const exportToCSV = () => {
    const headers = ['Date', 'Feature', 'Action', 'Tokens Used'];
    const rows = logs.map(log => [
      format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
      featureLabels[log.feature || ''] || log.feature || 'Unknown',
      log.action,
      log.tokens_used.toString(),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `token-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Exported', description: 'Token history exported to CSV' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Token Usage History</h1>
            <p className="text-muted-foreground">
              Track your token consumption across all features
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TokenDisplayHeader />
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tokens Used ({dateRange}d)</p>
                <p className="text-2xl font-bold">{totalTokensUsed}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. per Day</p>
                <p className="text-2xl font-bold">
                  {dailyUsage.length > 0 ? Math.round(totalTokensUsed / dailyUsage.length) : 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Usage
            </CardTitle>
            <CardDescription>Token consumption over time</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyUsage.length > 0 ? (
              <div className="flex items-end justify-between gap-1 h-32">
                {dailyUsage.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.total / maxDailyUsage) * 100}%` }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-sm min-h-[4px] relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {format(new Date(day.date), 'MMM d')}: {day.total} tokens
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                No usage data for this period
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={featureFilter} onValueChange={setFeatureFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All features" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All features</SelectItem>
            {Object.entries(featureLabels).map(([id, label]) => (
              <SelectItem key={id} value={id}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Usage Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Usage Log</CardTitle>
            <CardDescription>Detailed history of all token usage</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                    <div className="h-6 bg-muted rounded w-16" />
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No token usage found for this period</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => {
                  const FeatureIcon = featureIcons[log.feature || ''] || Coins;
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FeatureIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {featureLabels[log.feature || ''] || log.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        <Coins className="w-3 h-3 mr-1" />
                        -{log.tokens_used}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TokenHistory;
