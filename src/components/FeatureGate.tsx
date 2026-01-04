import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Crown, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFeatureAccess, FeatureId, SubscriptionPlan } from '@/hooks/useFeatureAccess';

interface FeatureGateProps {
  featureId: FeatureId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  className?: string;
}

const planIcons: Record<SubscriptionPlan, React.ElementType> = {
  FREE: Zap,
  CREATOR: Crown,
  PRO: Sparkles,
};

const planColors: Record<SubscriptionPlan, string> = {
  FREE: 'from-gray-500 to-gray-600',
  CREATOR: 'from-electric-purple to-ice-blue',
  PRO: 'from-amber-500 to-orange-500',
};

export const FeatureGate: React.FC<FeatureGateProps> = ({
  featureId,
  children,
  fallback,
  showUpgradePrompt = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { checkFeatureAccess, isLoggedIn } = useFeatureAccess();
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  
  const access = checkFeatureAccess(featureId);
  
  // If user has full access, render children
  if (access.hasAccess && !access.isLimited) {
    return <>{children}</>;
  }
  
  // If feature is limited, render children with a badge
  if (access.isLimited) {
    return (
      <div className={`relative ${className}`}>
        {children}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium border border-amber-500/30">
              Limited
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{access.upgradeMessage}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
  
  // If no access, show locked state
  const PlanIcon = planIcons[access.requiredPlan];
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  const handleUpgradeClick = () => {
    if (!isLoggedIn) {
      navigate('/auth?mode=signup');
    } else {
      setShowUpgradeModal(true);
    }
  };
  
  return (
    <>
      <div className={`relative ${className}`}>
        {/* Blurred/Disabled content */}
        <div className="relative pointer-events-none select-none">
          <div className="opacity-40 blur-[1px]">
            {children}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${planColors[access.requiredPlan]} flex items-center justify-center mx-auto mb-4`}>
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {access.requiredPlan} Feature
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                {access.upgradeMessage}
              </p>
              {showUpgradePrompt && (
                <Button
                  onClick={handleUpgradeClick}
                  className={`bg-gradient-to-r ${planColors[access.requiredPlan]} text-white pointer-events-auto`}
                >
                  <PlanIcon className="w-4 h-4 mr-2" />
                  Upgrade to {access.requiredPlan}
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        requiredPlan={access.requiredPlan}
      />
    </>
  );
};

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredPlan: SubscriptionPlan;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onOpenChange, requiredPlan }) => {
  const navigate = useNavigate();
  
  const planDetails: Record<SubscriptionPlan, { price: string; features: string[] }> = {
    FREE: { price: '$0', features: [] },
    CREATOR: {
      price: '$9/month',
      features: [
        '500 tokens/month',
        'HD thumbnails without watermark',
        'Full video ideas & scripts',
        'AI chat assistant',
        '1 brand profile',
        'Priority support',
      ],
    },
    PRO: {
      price: '$29/month',
      features: [
        '2,000 tokens/month',
        'Everything in Creator',
        'Advanced video scripting',
        'Content calendar & scheduling',
        'Batch generation',
        'Multi-language support',
        'Priority image generation',
        'Multiple brand profiles',
        'Fast generation speed',
      ],
    },
  };
  
  const details = planDetails[requiredPlan];
  const PlanIcon = planIcons[requiredPlan];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planColors[requiredPlan]} flex items-center justify-center`}>
              <PlanIcon className="w-5 h-5 text-white" />
            </div>
            Upgrade to {requiredPlan}
          </DialogTitle>
          <DialogDescription>
            Unlock this feature and more with the {requiredPlan} plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <span className="text-3xl font-bold">{details.price}</span>
          </div>
          
          <ul className="space-y-2">
            {details.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              // Navigate to homepage and scroll to pricing section
              window.location.href = '/#pricing';
            }}
            className={`flex-1 bg-gradient-to-r ${planColors[requiredPlan]} text-white`}
          >
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook for inline feature checks
export function useFeatureGate(featureId: FeatureId) {
  const { checkFeatureAccess, isLoggedIn } = useFeatureAccess();
  const access = checkFeatureAccess(featureId);
  
  return {
    ...access,
    isLoggedIn,
    isLocked: !access.hasAccess && !access.isLimited,
  };
}
