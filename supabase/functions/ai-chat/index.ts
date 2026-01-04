import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOKEN_COST = 1; // ai_chat costs 1 token

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-CHAT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { messages } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });
    
    // Get user's subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("plan, tokens_remaining")
      .eq("user_id", user.id)
      .single();
    
    if (subError || !subscription) {
      throw new Error("Could not verify subscription status");
    }
    
    logStep("User subscription", { plan: subscription.plan, tokens: subscription.tokens_remaining });
    
    // Check tokens
    if (subscription.tokens_remaining < TOKEN_COST) {
      return new Response(JSON.stringify({
        success: false,
        error: "insufficient_tokens",
        message: `You need ${TOKEN_COST} tokens. You have ${subscription.tokens_remaining} tokens remaining.`,
        tokensRequired: TOKEN_COST,
        tokensRemaining: subscription.tokens_remaining,
      }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Deduct tokens
    const { data: deductResult, error: deductError } = await supabaseClient.rpc('deduct_tokens', {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_action: 'ai_chat',
      p_feature: 'ai_chat',
      p_metadata: { messageCount: messages.length }
    });
    
    if (deductError || !deductResult) {
      logStep("ERROR: Token deduction failed", { error: deductError?.message });
      throw new Error("Failed to deduct tokens");
    }
    
    logStep("Tokens deducted", { cost: TOKEN_COST });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    logStep(`Processing chat with ${messages.length} messages`);

    const systemPrompt = `You are CreatorAI Assistant, an expert AI helper for content creators on YouTube, Instagram, TikTok, and other platforms. You specialize in:

1. **Content Strategy**: Helping creators plan their content calendar, identify trends, and optimize for growth
2. **Video Ideas**: Generating creative, viral-worthy video concepts tailored to specific niches
3. **SEO & Discoverability**: Optimizing titles, descriptions, tags, and thumbnails for maximum reach
4. **Engagement**: Tips for increasing watch time, comments, likes, and shares
5. **Monetization**: Strategies for growing revenue through ads, sponsorships, and products
6. **Analytics**: Interpreting performance data and providing actionable insights
7. **Branding**: Building a consistent, memorable creator identity

Be friendly, encouraging, and provide specific, actionable advice. Use examples when helpful. Keep responses concise but comprehensive.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in ai-chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
