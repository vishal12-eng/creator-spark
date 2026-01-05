import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TokenCost {
  feature_id: string;
  feature_name: string;
  token_cost: number;
  description: string | null;
}

export const useTokenCosts = () => {
  const [tokenCosts, setTokenCosts] = useState<TokenCost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenCosts = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_token_costs')
          .select('feature_id, feature_name, token_cost, description')
          .order('feature_name');

        if (error) throw error;
        setTokenCosts(data || []);
      } catch (err) {
        console.error('Error fetching token costs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch token costs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenCosts();
  }, []);

  const getTokenCost = (featureId: string): number => {
    const feature = tokenCosts.find(tc => tc.feature_id === featureId);
    return feature?.token_cost || 1;
  };

  const getFeatureName = (featureId: string): string => {
    const feature = tokenCosts.find(tc => tc.feature_id === featureId);
    return feature?.feature_name || featureId;
  };

  return {
    tokenCosts,
    isLoading,
    error,
    getTokenCost,
    getFeatureName,
  };
};
