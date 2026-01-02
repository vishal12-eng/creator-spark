import React from 'react';
import { motion } from 'framer-motion';
import { Coins, AlertTriangle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TokenDisplayProps {
  compact?: boolean;
  showUpgrade?: boolean;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ 
  compact = false,
  showUpgrade = true 
}) => {
  const navigate = useNavigate();
  const { subscription, session } = useAuth();
  const [tokenInfo, setTokenInfo] = React.useState<{
    remaining: number;
    limit: number;
  }>({ remaining: 0, limit: 20 });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
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

    fetchTokens();
  }, [session]);

  const percentage = tokenInfo.limit > 0 
    ? (tokenInfo.remaining / tokenInfo.limit) * 100 
    : 0;
  
  const isLow = percentage < 20;
  const isEmpty = tokenInfo.remaining <= 0;

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded-lg h-16 w-full" />
    );
  }

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isEmpty ? 'bg-destructive/10 text-destructive' :
            isLow ? 'bg-amber-500/10 text-amber-500' :
            'bg-primary/10 text-primary'
          }`}>
            <Coins className="w-4 h-4" />
            <span className="font-semibold">{tokenInfo.remaining}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tokenInfo.remaining} of {tokenInfo.limit} tokens remaining</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${
        isEmpty ? 'border-destructive/30 bg-destructive/5' :
        isLow ? 'border-amber-500/30 bg-amber-500/5' :
        'border-border bg-card'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isEmpty ? 'bg-destructive/10' :
            isLow ? 'bg-amber-500/10' :
            'bg-primary/10'
          }`}>
            {isEmpty ? (
              <AlertTriangle className="w-4 h-4 text-destructive" />
            ) : (
              <Coins className={`w-4 h-4 ${isLow ? 'text-amber-500' : 'text-primary'}`} />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm">Tokens</h4>
            <p className="text-xs text-muted-foreground">
              {subscription.plan} Plan
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${
            isEmpty ? 'text-destructive' :
            isLow ? 'text-amber-500' : ''
          }`}>
            {tokenInfo.remaining}
          </span>
          <span className="text-muted-foreground text-sm">/{tokenInfo.limit}</span>
        </div>
      </div>
      
      <Progress 
        value={percentage} 
        className={`h-2 ${
          isEmpty ? '[&>div]:bg-destructive' :
          isLow ? '[&>div]:bg-amber-500' : ''
        }`}
      />
      
      {(isEmpty || isLow) && showUpgrade && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isEmpty ? 'No tokens left this month' : 'Running low on tokens'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/#pricing')}
            className="text-xs"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Upgrade
          </Button>
        </div>
      )}
    </motion.div>
  );
};
