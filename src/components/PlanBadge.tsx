import React from 'react';
import { Crown, Zap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/hooks/useFeatureAccess';

interface PlanBadgeProps {
  plan: SubscriptionPlan;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const planConfig: Record<SubscriptionPlan, {
  icon: React.ElementType;
  label: string;
  className: string;
}> = {
  FREE: {
    icon: Zap,
    label: 'Free',
    className: 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20',
  },
  CREATOR: {
    icon: Crown,
    label: 'Creator',
    className: 'bg-gradient-to-r from-electric-purple/10 to-ice-blue/10 text-electric-purple border-electric-purple/20 hover:from-electric-purple/20 hover:to-ice-blue/20',
  },
  PRO: {
    icon: Sparkles,
    label: 'Pro',
    className: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20',
  },
};

const sizeConfig = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconSizeConfig = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const PlanBadge: React.FC<PlanBadgeProps> = ({
  plan,
  size = 'md',
  showIcon = true,
}) => {
  const config = planConfig[plan];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${sizeConfig[size]} font-medium flex items-center gap-1`}
    >
      {showIcon && <Icon className={iconSizeConfig[size]} />}
      {config.label}
    </Badge>
  );
};
