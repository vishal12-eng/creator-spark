import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOKEN_COST = 1; // idea_generation costs 1 token

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-VIDEO-IDEAS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { niche, platform, count = 5 } = await req.json();
    
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
      p_action: 'idea_generation',
      p_feature: 'video_ideas',
      p_metadata: { niche, platform, count }
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

    logStep(`Generating ${count} video ideas for niche: ${niche}, platform: ${platform}`);

    const systemPrompt = `You are an expert content strategist specializing in ${platform} content creation. Generate viral video ideas that are optimized for engagement and discoverability.

For each video idea, provide:
1. A catchy, SEO-optimized title
2. A compelling description (2-3 sentences)
3. 5-7 relevant hashtags
4. An attention-grabbing hook (first 3 seconds script)
5. Estimated viral potential score (1-100)
6. Best posting time recommendation

Format your response as a JSON array with objects containing: title, description, hashtags (array), hook, viralScore, bestPostingTime`;

    const userPrompt = `Generate ${count} unique, trending video ideas for the "${niche}" niche on ${platform}. Focus on current trends, emotional hooks, and high-engagement formats. Make them actionable and specific.`;

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
          { role: "user", content: userPrompt }
        ],
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse JSON from the response
    let ideas;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      ideas = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      ideas = [{
        title: "Video Idea",
        description: content,
        hashtags: [],
        hook: "",
        viralScore: 75,
        bestPostingTime: "Peak hours"
      }];
    }

    // Get updated token count
    const { data: updatedSub } = await supabaseClient
      .from("subscriptions")
      .select("tokens_remaining")
      .eq("user_id", user.id)
      .single();

    logStep(`Generated ${ideas.length} video ideas successfully`);

    return new Response(JSON.stringify({ 
      ideas,
      tokensUsed: TOKEN_COST,
      tokensRemaining: updatedSub?.tokens_remaining ?? 0,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-video-ideas:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
