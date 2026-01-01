-- Create enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('FREE', 'CREATOR', 'PRO');

-- Create subscriptions table to track user plans and tokens
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'FREE',
  tokens_remaining INTEGER NOT NULL DEFAULT 20,
  tokens_monthly_limit INTEGER NOT NULL DEFAULT 20,
  plan_expiry TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create token usage logs table
CREATE TABLE public.token_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  feature TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brand profiles table for brand memory feature
CREATE TABLE public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  tone_settings JSONB NOT NULL DEFAULT '{}',
  color_palette JSONB DEFAULT '[]',
  target_audience TEXT,
  brand_voice TEXT,
  keywords TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id);

-- Service role can insert/update subscriptions (for webhooks)
CREATE POLICY "Service can manage subscriptions"
ON public.subscriptions FOR ALL
USING (auth.role() = 'service_role');

-- RLS policies for token usage logs
CREATE POLICY "Users can view their own token logs"
ON public.token_usage_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token logs"
ON public.token_usage_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for brand profiles
CREATE POLICY "Users can view their own brand profiles"
ON public.brand_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand profiles"
ON public.brand_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand profiles"
ON public.brand_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand profiles"
ON public.brand_profiles FOR DELETE
USING (auth.uid() = user_id);

-- Function to create subscription on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, tokens_remaining, tokens_monthly_limit)
  VALUES (NEW.id, 'FREE', 20, 20);
  RETURN NEW;
END;
$$;

-- Trigger to auto-create subscription on user signup
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Function to get user's subscription with plan details
CREATE OR REPLACE FUNCTION public.get_user_subscription(p_user_id UUID)
RETURNS TABLE (
  plan subscription_plan,
  tokens_remaining INTEGER,
  tokens_monthly_limit INTEGER,
  plan_expiry TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT s.plan, s.tokens_remaining, s.tokens_monthly_limit, s.plan_expiry
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id;
END;
$$;

-- Function to deduct tokens (server-side only)
CREATE OR REPLACE FUNCTION public.deduct_tokens(
  p_user_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_feature TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_tokens INTEGER;
BEGIN
  -- Get current tokens
  SELECT tokens_remaining INTO v_current_tokens
  FROM public.subscriptions
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- Check if user has enough tokens
  IF v_current_tokens IS NULL OR v_current_tokens < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct tokens
  UPDATE public.subscriptions
  SET tokens_remaining = tokens_remaining - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log the usage
  INSERT INTO public.token_usage_logs (user_id, action, tokens_used, feature, metadata)
  VALUES (p_user_id, p_action, p_amount, p_feature, p_metadata);
  
  RETURN TRUE;
END;
$$;

-- Function to reset tokens monthly
CREATE OR REPLACE FUNCTION public.reset_user_tokens(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.subscriptions
  SET tokens_remaining = tokens_monthly_limit,
      plan_expiry = now() + INTERVAL '1 month',
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- Function to upgrade user plan
CREATE OR REPLACE FUNCTION public.upgrade_user_plan(
  p_user_id UUID,
  p_plan subscription_plan,
  p_stripe_customer_id TEXT DEFAULT NULL,
  p_stripe_subscription_id TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_limit INTEGER;
BEGIN
  -- Set token limit based on plan
  v_token_limit := CASE p_plan
    WHEN 'FREE' THEN 20
    WHEN 'CREATOR' THEN 500
    WHEN 'PRO' THEN 2000
  END;
  
  UPDATE public.subscriptions
  SET plan = p_plan,
      tokens_remaining = v_token_limit,
      tokens_monthly_limit = v_token_limit,
      plan_expiry = now() + INTERVAL '1 month',
      stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
      stripe_subscription_id = COALESCE(p_stripe_subscription_id, stripe_subscription_id),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- Function to check brand profile limits
CREATE OR REPLACE FUNCTION public.can_create_brand_profile(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan subscription_plan;
  v_brand_count INTEGER;
  v_limit INTEGER;
BEGIN
  -- Get user's plan
  SELECT plan INTO v_plan FROM public.subscriptions WHERE user_id = p_user_id;
  
  -- Count existing brand profiles
  SELECT COUNT(*) INTO v_brand_count FROM public.brand_profiles WHERE user_id = p_user_id;
  
  -- Set limit based on plan
  v_limit := CASE v_plan
    WHEN 'FREE' THEN 0
    WHEN 'CREATOR' THEN 1
    WHEN 'PRO' THEN 10
    ELSE 0
  END;
  
  RETURN v_brand_count < v_limit;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_token_usage_logs_user_id ON public.token_usage_logs(user_id);
CREATE INDEX idx_token_usage_logs_created_at ON public.token_usage_logs(created_at);
CREATE INDEX idx_brand_profiles_user_id ON public.brand_profiles(user_id);

-- Update timestamp trigger
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();