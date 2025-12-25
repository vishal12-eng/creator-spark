-- Create analytics_reports table
CREATE TABLE public.analytics_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  seo_score INTEGER NOT NULL DEFAULT 0,
  ctr_potential INTEGER NOT NULL DEFAULT 0,
  keyword_strength INTEGER NOT NULL DEFAULT 0,
  hook_effectiveness INTEGER NOT NULL DEFAULT 0,
  thumbnail_readability INTEGER NOT NULL DEFAULT 0,
  overall_score INTEGER NOT NULL DEFAULT 0,
  issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  improvements TEXT[] NOT NULL DEFAULT '{}',
  optimized_title TEXT,
  optimized_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics reports" ON public.analytics_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analytics reports" ON public.analytics_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analytics reports" ON public.analytics_reports FOR DELETE USING (auth.uid() = user_id);

-- Create branding_kits table
CREATE TABLE public.branding_kits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  niche TEXT NOT NULL,
  target_audience TEXT,
  personality TEXT,
  channel_names TEXT[] NOT NULL DEFAULT '{}',
  logo_ideas TEXT[] NOT NULL DEFAULT '{}',
  banner_text TEXT,
  about_section TEXT,
  niche_positioning TEXT,
  color_palette TEXT[] NOT NULL DEFAULT '{}',
  content_pillars TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.branding_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own branding kits" ON public.branding_kits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own branding kits" ON public.branding_kits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own branding kits" ON public.branding_kits FOR DELETE USING (auth.uid() = user_id);

-- Create niche_analyses table
CREATE TABLE public.niche_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  niche TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'YouTube',
  competition_level TEXT NOT NULL,
  competition_score INTEGER NOT NULL DEFAULT 0,
  growth_opportunity TEXT NOT NULL,
  growth_score INTEGER NOT NULL DEFAULT 0,
  monetization_potential TEXT NOT NULL,
  monetization_score INTEGER NOT NULL DEFAULT 0,
  top_competitors TEXT[] NOT NULL DEFAULT '{}',
  sub_niches TEXT[] NOT NULL DEFAULT '{}',
  content_gaps TEXT[] NOT NULL DEFAULT '{}',
  trending_topics TEXT[] NOT NULL DEFAULT '{}',
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.niche_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own niche analyses" ON public.niche_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own niche analyses" ON public.niche_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own niche analyses" ON public.niche_analyses FOR DELETE USING (auth.uid() = user_id);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can read published posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
-- Admins can manage all posts (will use has_role function)

-- Create user_roles table for admin system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles - users can see their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage blog posts
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage user roles
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Storage policies for thumbnails
CREATE POLICY "Thumbnail images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger for blog posts updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();