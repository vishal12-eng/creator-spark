-- Create feature_token_costs table for admin-configurable token costs
CREATE TABLE public.feature_token_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_id TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  token_cost INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_token_costs ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read token costs
CREATE POLICY "Anyone can read token costs"
  ON public.feature_token_costs
  FOR SELECT
  USING (true);

-- Only admins can update token costs
CREATE POLICY "Admins can update token costs"
  ON public.feature_token_costs
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert token costs"
  ON public.feature_token_costs
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default token costs
INSERT INTO public.feature_token_costs (feature_id, feature_name, token_cost, description) VALUES
  ('thumbnail_generation', 'Thumbnail Generator', 5, 'Generate AI-powered thumbnails'),
  ('video_ideas', 'Video Ideas', 3, 'Generate video ideas and scripts'),
  ('content_analytics', 'Content Analytics', 2, 'Analyze content performance'),
  ('channel_branding', 'Channel Branding', 5, 'Generate brand kit'),
  ('niche_analyzer', 'Niche Analyzer', 3, 'Analyze niche opportunities'),
  ('ai_chat', 'AI Chat', 1, 'Chat with AI assistant'),
  ('advanced_scripting', 'Advanced Scripting', 4, 'Generate advanced scripts'),
  ('batch_generation', 'Batch Generation', 10, 'Batch generate content');

-- Create trigger for updated_at
CREATE TRIGGER update_feature_token_costs_updated_at
  BEFORE UPDATE ON public.feature_token_costs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for token_usage_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_usage_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;