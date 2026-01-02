import { useAuth } from '@/contexts/AuthContext';

export type SubscriptionPlan = 'FREE' | 'CREATOR' | 'PRO';

export type FeatureId = 
  | 'idea_generation'
  | 'hook_generator'
  | 'short_scripts'
  | 'long_scripts'
  | 'image_generation'
  | 'thumbnail_prompts'
  | 'advanced_video_scripting'
  | 'content_calendar'
  | 'batch_generation'
  | 'advanced_prompt_controls'
  | 'multi_language'
  | 'priority_image_generation'
  | 'brand_profile'
  | 'ai_chat'
  | 'niche_analyzer'
  | 'content_analytics';

export interface FeatureConfig {
  id: FeatureId;
  name: string;
  description: string;
  requiredPlan: SubscriptionPlan;
  tokenCost: number;
  isLimited?: boolean; // For features available but limited on lower plans
}

// Token costs for each feature
export const TOKEN_COSTS: Record<string, number> = {
  idea_generation: 1,
  hook_generator: 1,
  short_scripts: 2,
  long_scripts: 4,
  thumbnail_prompts: 2,
  image_generation: 5,
  advanced_video_scripting: 4,
  content_calendar: 0,
  batch_generation: 10,
  advanced_prompt_controls: 0,
  multi_language: 2,
  priority_image_generation: 5,
  brand_profile: 2,
  ai_chat: 1,
  niche_analyzer: 2,
  content_analytics: 1,
};

// Feature access matrix
export const FEATURE_MATRIX: Record<FeatureId, { FREE: boolean | 'limited'; CREATOR: boolean; PRO: boolean }> = {
  idea_generation: { FREE: true, CREATOR: true, PRO: true },
  hook_generator: { FREE: 'limited', CREATOR: true, PRO: true },
  short_scripts: { FREE: 'limited', CREATOR: true, PRO: true },
  long_scripts: { FREE: false, CREATOR: true, PRO: true },
  image_generation: { FREE: true, CREATOR: true, PRO: true }, // But watermarked for FREE
  thumbnail_prompts: { FREE: false, CREATOR: true, PRO: true },
  advanced_video_scripting: { FREE: false, CREATOR: false, PRO: true },
  content_calendar: { FREE: false, CREATOR: false, PRO: true },
  batch_generation: { FREE: false, CREATOR: false, PRO: true },
  advanced_prompt_controls: { FREE: false, CREATOR: false, PRO: true },
  multi_language: { FREE: false, CREATOR: false, PRO: true },
  priority_image_generation: { FREE: false, CREATOR: false, PRO: true },
  brand_profile: { FREE: false, CREATOR: true, PRO: true },
  ai_chat: { FREE: 'limited', CREATOR: true, PRO: true },
  niche_analyzer: { FREE: 'limited', CREATOR: true, PRO: true },
  content_analytics: { FREE: 'limited', CREATOR: true, PRO: true },
};

// Plan limits for brand profiles
export const BRAND_PROFILE_LIMITS: Record<SubscriptionPlan, number> = {
  FREE: 0,
  CREATOR: 1,
  PRO: 10,
};

export interface FeatureAccessResult {
  hasAccess: boolean;
  isLimited: boolean;
  requiredPlan: SubscriptionPlan;
  currentPlan: SubscriptionPlan;
  tokenCost: number;
  canAfford: boolean;
  tokensRemaining: number;
  upgradeMessage: string;
}

export function useFeatureAccess() {
  const { subscription, user } = useAuth();
  
  const currentPlan: SubscriptionPlan = subscription.plan || 'FREE';

  const checkFeatureAccess = (featureId: FeatureId): FeatureAccessResult => {
    const access = FEATURE_MATRIX[featureId];
    const tokenCost = TOKEN_COSTS[featureId] || 0;
    
    // Mock tokens remaining - in real app, fetch from subscription state
    const tokensRemaining = 100; // This should come from subscription state
    
    const featureAccess = access[currentPlan];
    const hasAccess = featureAccess === true;
    const isLimited = featureAccess === 'limited';
    const canAfford = tokensRemaining >= tokenCost;
    
    // Determine minimum required plan for full access
    let requiredPlan: SubscriptionPlan = 'FREE';
    if (!access.FREE || access.FREE === 'limited') {
      if (access.CREATOR === true) {
        requiredPlan = 'CREATOR';
      } else if (access.PRO === true) {
        requiredPlan = 'PRO';
      }
    }
    
    const upgradeMessage = !hasAccess && !isLimited
      ? `Upgrade to ${requiredPlan} to unlock this feature`
      : isLimited
      ? `Upgrade to ${requiredPlan} for unlimited access`
      : '';
    
    return {
      hasAccess: hasAccess || isLimited,
      isLimited,
      requiredPlan,
      currentPlan,
      tokenCost,
      canAfford,
      tokensRemaining,
      upgradeMessage,
    };
  };

  const getMinimumPlanForFeature = (featureId: FeatureId): SubscriptionPlan => {
    const access = FEATURE_MATRIX[featureId];
    if (access.FREE === true) return 'FREE';
    if (access.CREATOR === true) return 'CREATOR';
    return 'PRO';
  };

  const isFeatureAvailableForPlan = (featureId: FeatureId, plan: SubscriptionPlan): boolean | 'limited' => {
    return FEATURE_MATRIX[featureId][plan];
  };

  const shouldShowWatermark = (): boolean => {
    return currentPlan === 'FREE';
  };

  return {
    currentPlan,
    checkFeatureAccess,
    getMinimumPlanForFeature,
    isFeatureAvailableForPlan,
    shouldShowWatermark,
    isLoggedIn: !!user,
  };
}
