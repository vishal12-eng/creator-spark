import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TokenCostBadgeProps {
  cost: number;
  featureName?: string;
  className?: string;
  showLabel?: boolean;
}

export const TokenCostBadge: React.FC<TokenCostBadgeProps> = ({
  cost,
  featureName,
  className = '',
  showLabel = true,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 ${className}`}
        >
          <Coins className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">{cost}</span>
          {showLabel && (
            <span className="text-xs text-muted-foreground">tokens</span>
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>
            {featureName ? `${featureName} costs` : 'This feature costs'} <strong>{cost} tokens</strong> per use
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
