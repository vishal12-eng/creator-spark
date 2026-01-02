import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Map Stripe product IDs to subscription plans
const PRODUCT_TO_PLAN: Record<string, string> = {
  "prod_TiWC2gNkum9OVJ": "CREATOR",
  "prod_TiWDgLPNzQTa8f": "PRO",
};

// Token limits per plan
const PLAN_TOKEN_LIMITS: Record<string, number> = {
  "FREE": 20,
  "CREATOR": 500,
  "PRO": 2000,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, checking for existing subscription record");
      
      // Get current subscription from database
      const { data: existingSub } = await supabaseClient
        .from("subscriptions")
        .select("plan, tokens_remaining, tokens_monthly_limit, plan_expiry")
        .eq("user_id", user.id)
        .single();
      
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan: existingSub?.plan || "FREE",
        tokens_remaining: existingSub?.tokens_remaining || 20,
        tokens_monthly_limit: existingSub?.tokens_monthly_limit || 20,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let plan = "FREE";
    let productId = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product as string;
      plan = PRODUCT_TO_PLAN[productId] || "FREE";
      logStep("Active subscription found", { subscriptionId: subscription.id, productId, plan, endDate: subscriptionEnd });
    } else {
      logStep("No active subscription found");
    }

    // Get current subscription from database to check if plan changed
    const { data: currentSub } = await supabaseClient
      .from("subscriptions")
      .select("plan, tokens_remaining")
      .eq("user_id", user.id)
      .single();

    const tokenLimit = PLAN_TOKEN_LIMITS[plan] || 20;
    
    // Only reset tokens if plan is being upgraded
    const shouldResetTokens = currentSub && currentSub.plan !== plan && 
      (plan === "PRO" || (plan === "CREATOR" && currentSub.plan === "FREE"));
    
    const newTokens = shouldResetTokens ? tokenLimit : (currentSub?.tokens_remaining || tokenLimit);

    // Update the user's subscription in the database
    const { error: updateError } = await supabaseClient
      .from("subscriptions")
      .update({
        plan: plan,
        tokens_remaining: newTokens,
        tokens_monthly_limit: tokenLimit,
        plan_expiry: subscriptionEnd,
        stripe_customer_id: customerId,
        stripe_subscription_id: hasActiveSub ? subscriptions.data[0].id : null,
      })
      .eq("user_id", user.id);

    if (updateError) {
      logStep("ERROR updating subscription", { error: updateError.message });
    } else {
      logStep("Subscription updated in database", { plan, tokenLimit, tokensReset: shouldResetTokens });
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      plan: plan,
      product_id: productId,
      subscription_end: subscriptionEnd,
      tokens_remaining: newTokens,
      tokens_monthly_limit: tokenLimit,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
