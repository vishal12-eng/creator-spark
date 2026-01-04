import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOKEN_COST = 2; // niche_analyzer costs 2 tokens

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-NICHE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { niche, platform } = await req.json();
    
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
      p_action: 'niche_analyzer',
      p_feature: 'niche_analyzer',
      p_metadata: { niche, platform }
    });
    
    if (deductError || !deductResult) {
      logStep("ERROR: Token deduction failed", { error: deductError?.message });
      throw new Error("Failed to deduct tokens");
    }
    
    logStep("Tokens deducted", { cost: TOKEN_COST });
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a market research expert specializing in content creation niches on social media platforms. Provide data-driven insights and actionable recommendations. Always respond with valid JSON.`;

    const userPrompt = `Analyze the competition and opportunity for this content niche:

Niche: ${niche}
Platform: ${platform || 'YouTube'}

Provide a comprehensive JSON analysis with this exact structure:
{
  "competitionLevel": "<Low/Medium/High/Very High>",
  "competitionScore": <number 0-100>,
  "growthOpportunity": "<description of growth potential>",
  "growthScore": <number 0-100>,
  "monetizationPotential": "<description of monetization options>",
  "monetizationScore": <number 0-100>,
  "topCompetitors": ["<5 example channel types or creator archetypes in this niche>"],
  "subNiches": ["<5 less competitive sub-niche opportunities>"],
  "contentGaps": ["<4 underserved content areas or angles>"],
  "trendingTopics": ["<5 currently trending topics in this niche>"],
  "recommendations": ["<5 strategic recommendations for entering this niche>"]
}`;

    logStep('Calling AI gateway for niche analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    logStep('Raw AI response received');

    // Parse JSON from response
    let result;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Get updated token count
    const { data: updatedSub } = await supabaseClient
      .from("subscriptions")
      .select("tokens_remaining")
      .eq("user_id", user.id)
      .single();

    return new Response(JSON.stringify({ 
      success: true, 
      result,
      tokensUsed: TOKEN_COST,
      tokensRemaining: updatedSub?.tokens_remaining ?? 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in analyze-niche:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
