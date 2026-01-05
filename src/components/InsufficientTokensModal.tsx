import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Sparkles, AlertTriangle, Zap, Crown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface InsufficientTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredTokens?: number;
  featureName?: string;
}

export const InsufficientTokensModal: React.FC<InsufficientTokensModalProps> = ({
  open,
  onOpenChange,
  requiredTokens = 1,
  featureName = 'this feature',
}) => {
  const { subscription } = useAuth();

  const plans = [
    {
      name: 'CREATOR',
      price: '$9/month',
      tokens: 500,
      icon: Crown,
      color: 'from-electric-purple to-ice-blue',
      features: ['500 tokens/month', 'HD thumbnails', 'AI chat assistant', '1 brand profile'],
    },
    {
      name: 'PRO',
      price: '$29/month',
      tokens: 2000,
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      features: ['2,000 tokens/month', 'Advanced scripting', 'Batch generation', 'Priority support'],
    },
  ];

  const handleViewPlans = () => {
    onOpenChange(false);
    window.location.href = '/#pricing';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30"
            >
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </motion.div>
            <div>
              <span className="block">Insufficient Tokens</span>
              <span className="text-sm font-normal text-muted-foreground">
                You need more tokens to use {featureName}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-muted/50 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Current Balance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-destructive">0</span>
                <span className="text-muted-foreground">tokens</span>
              </div>
            </div>
            <Progress value={0} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              You need <span className="font-semibold text-foreground">{requiredTokens} tokens</span> for {featureName}
            </p>
          </motion.div>

          {/* Upgrade options */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Upgrade for more tokens
            </h4>
            
            <div className="grid gap-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all cursor-pointer group ${
                    subscription.plan === plan.name ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={handleViewPlans}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <plan.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold block">{plan.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {plan.tokens} tokens/month
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{plan.price}</span>
                      <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        View details →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Maybe Later
          </Button>
          <Button
            onClick={handleViewPlans}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
