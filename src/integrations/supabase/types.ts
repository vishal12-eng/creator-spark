export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_reports: {
        Row: {
          created_at: string
          ctr_potential: number
          description: string | null
          hook_effectiveness: number
          id: string
          improvements: string[]
          issues: Json
          keyword_strength: number
          optimized_description: string | null
          optimized_title: string | null
          overall_score: number
          seo_score: number
          tags: string[] | null
          thumbnail_readability: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ctr_potential?: number
          description?: string | null
          hook_effectiveness?: number
          id?: string
          improvements?: string[]
          issues?: Json
          keyword_strength?: number
          optimized_description?: string | null
          optimized_title?: string | null
          overall_score?: number
          seo_score?: number
          tags?: string[] | null
          thumbnail_readability?: number
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          ctr_potential?: number
          description?: string | null
          hook_effectiveness?: number
          id?: string
          improvements?: string[]
          issues?: Json
          keyword_strength?: number
          optimized_description?: string | null
          optimized_title?: string | null
          overall_score?: number
          seo_score?: number
          tags?: string[] | null
          thumbnail_readability?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_id: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      brand_profiles: {
        Row: {
          brand_name: string
          brand_voice: string | null
          color_palette: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          keywords: string[] | null
          target_audience: string | null
          tone_settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_name: string
          brand_voice?: string | null
          color_palette?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          target_audience?: string | null
          tone_settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_name?: string
          brand_voice?: string | null
          color_palette?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          target_audience?: string | null
          tone_settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      branding_kits: {
        Row: {
          about_section: string | null
          banner_text: string | null
          channel_names: string[]
          color_palette: string[]
          content_pillars: string[]
          created_at: string
          id: string
          logo_ideas: string[]
          niche: string
          niche_positioning: string | null
          personality: string | null
          target_audience: string | null
          user_id: string
        }
        Insert: {
          about_section?: string | null
          banner_text?: string | null
          channel_names?: string[]
          color_palette?: string[]
          content_pillars?: string[]
          created_at?: string
          id?: string
          logo_ideas?: string[]
          niche: string
          niche_positioning?: string | null
          personality?: string | null
          target_audience?: string | null
          user_id: string
        }
        Update: {
          about_section?: string | null
          banner_text?: string | null
          channel_names?: string[]
          color_palette?: string[]
          content_pillars?: string[]
          created_at?: string
          id?: string
          logo_ideas?: string[]
          niche?: string
          niche_positioning?: string | null
          personality?: string | null
          target_audience?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      niche_analyses: {
        Row: {
          competition_level: string
          competition_score: number
          content_gaps: string[]
          created_at: string
          growth_opportunity: string
          growth_score: number
          id: string
          monetization_potential: string
          monetization_score: number
          niche: string
          platform: string
          recommendations: string[]
          sub_niches: string[]
          top_competitors: string[]
          trending_topics: string[]
          user_id: string
        }
        Insert: {
          competition_level: string
          competition_score?: number
          content_gaps?: string[]
          created_at?: string
          growth_opportunity: string
          growth_score?: number
          id?: string
          monetization_potential: string
          monetization_score?: number
          niche: string
          platform?: string
          recommendations?: string[]
          sub_niches?: string[]
          top_competitors?: string[]
          trending_topics?: string[]
          user_id: string
        }
        Update: {
          competition_level?: string
          competition_score?: number
          content_gaps?: string[]
          created_at?: string
          growth_opportunity?: string
          growth_score?: number
          id?: string
          monetization_potential?: string
          monetization_score?: number
          niche?: string
          platform?: string
          recommendations?: string[]
          sub_niches?: string[]
          top_competitors?: string[]
          trending_topics?: string[]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          plan_expiry: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tokens_monthly_limit: number
          tokens_remaining: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          plan_expiry?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tokens_monthly_limit?: number
          tokens_remaining?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          plan_expiry?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tokens_monthly_limit?: number
          tokens_remaining?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      thumbnails: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          prompt: string | null
          style: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          prompt?: string | null
          style?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          prompt?: string | null
          style?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      token_usage_logs: {
        Row: {
          action: string
          created_at: string
          feature: string | null
          id: string
          metadata: Json | null
          tokens_used: number
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          feature?: string | null
          id?: string
          metadata?: Json | null
          tokens_used: number
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          feature?: string | null
          id?: string
          metadata?: Json | null
          tokens_used?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_ideas: {
        Row: {
          created_at: string
          id: string
          ideas: Json
          niche: string
          platform: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ideas?: Json
          niche: string
          platform: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ideas?: Json
          niche?: string
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_brand_profile: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      deduct_tokens: {
        Args: {
          p_action: string
          p_amount: number
          p_feature?: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: boolean
      }
      get_user_subscription: {
        Args: { p_user_id: string }
        Returns: {
          plan: Database["public"]["Enums"]["subscription_plan"]
          plan_expiry: string
          tokens_monthly_limit: number
          tokens_remaining: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reset_user_tokens: { Args: { p_user_id: string }; Returns: undefined }
      upgrade_user_plan: {
        Args: {
          p_plan: Database["public"]["Enums"]["subscription_plan"]
          p_stripe_customer_id?: string
          p_stripe_subscription_id?: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_plan: "FREE" | "CREATOR" | "PRO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      subscription_plan: ["FREE", "CREATOR", "PRO"],
    },
  },
} as const
