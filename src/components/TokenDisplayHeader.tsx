import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface TokenDisplayHeaderProps {
  className?: string;
}

export const TokenDisplayHeader: React.FC<TokenDisplayHeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { session, subscription } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<{
    remaining: number;
    limit: number;
  }>({ remaining: 0, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [prevTokens, setPrevTokens] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchTokens = async () => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('tokens_remaining, tokens_monthly_limit')
        .eq('user_id', session.user.id)
        .single();

      if (data && !error) {
        if (prevTokens !== null && data.tokens_remaining !== prevTokens) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);
        }
        setPrevTokens(tokenInfo.remaining);
        setTokenInfo({
          remaining: data.tokens_remaining,
          limit: data.tokens_monthly_limit,
        });
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [session]);

  // Real-time subscription for token updates
  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel('token-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const newData = payload.new as { tokens_remaining: number; tokens_monthly_limit: number };
            setPrevTokens(tokenInfo.remaining);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
            setTokenInfo({
              remaining: newData.tokens_remaining,
              limit: newData.tokens_monthly_limit,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, tokenInfo.remaining]);

  const percentage = tokenInfo.limit > 0 
    ? (tokenInfo.remaining / tokenInfo.limit) * 100 
    : 0;
  
  const isLow = percentage < 20;
  const isEmpty = tokenInfo.remaining <= 0;

  const getStatusColor = () => {
    if (isEmpty) return 'from-destructive/80 to-destructive';
    if (isLow) return 'from-amber-500/80 to-amber-500';
    return 'from-primary/80 to-primary';
  };

  const getBgColor = () => {
    if (isEmpty) return 'bg-destructive/10 border-destructive/30';
    if (isLow) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-primary/10 border-primary/30';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded-xl h-10 w-24" />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={() => navigate('/dashboard/history')}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:scale-105 cursor-pointer ${getBgColor()} ${className}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getStatusColor()} opacity-20 blur-sm`} />
          
          {/* Content */}
          <div className="relative flex items-center gap-2">
            <motion.div
              animate={isAnimating ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Coins className={`w-4 h-4 ${isEmpty ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-primary'}`} />
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={tokenInfo.remaining}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`font-bold text-sm ${isEmpty ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-foreground'}`}
              >
                {tokenInfo.remaining}
              </motion.span>
            </AnimatePresence>
            
            <span className="text-xs text-muted-foreground">tokens</span>
          </div>

          {/* Upgrade indicator for low tokens */}
          {(isEmpty || isLow) && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                <TrendingUp className="w-2 h-2 text-white" />
              </div>
            </motion.div>
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">{subscription.plan} Plan</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {tokenInfo.remaining} of {tokenInfo.limit} tokens remaining
          </p>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${getStatusColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Click to view usage history</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
