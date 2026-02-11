import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language, reviewType, userId } = await req.json();
    if (!code || !language || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const reviewFocus = reviewType === "all"
      ? "code quality, security vulnerabilities, and performance issues"
      : reviewType === "quality"
      ? "code quality, bugs, and style issues"
      : reviewType === "security"
      ? "security vulnerabilities and unsafe patterns"
      : "performance bottlenecks and optimization opportunities";

    const systemPrompt = `You are an expert code reviewer. Analyze the given ${language} code focusing on ${reviewFocus}.

Return a JSON response using the suggest_review tool with:
- findings: array of issues found, each with: type (bug|security|performance|style), severity (error|warning|info), line (number or null), message (what's wrong), suggestion (how to fix)
- summary: a 1-2 sentence overview of the code quality
- score: integer 0-100 rating the overall code quality
- rewritten_code: the improved/refactored version of the code

Be thorough but practical. Focus on real issues, not nitpicks.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Review this ${language} code:\n\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\`` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_review",
              description: "Return structured code review results",
              parameters: {
                type: "object",
                properties: {
                  findings: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["bug", "security", "performance", "style"] },
                        severity: { type: "string", enum: ["error", "warning", "info"] },
                        line: { type: "number" },
                        message: { type: "string" },
                        suggestion: { type: "string" },
                      },
                      required: ["type", "severity", "message", "suggestion"],
                      additionalProperties: false,
                    },
                  },
                  summary: { type: "string" },
                  score: { type: "number" },
                  rewritten_code: { type: "string" },
                },
                required: ["findings", "summary", "score", "rewritten_code"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_review" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const reviewData = JSON.parse(toolCall.function.arguments);

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: insertedReview, error: dbError } = await supabase
      .from("code_reviews")
      .insert({
        user_id: userId,
        language,
        review_type: reviewType,
        original_code: code,
        findings: { findings: reviewData.findings, summary: reviewData.summary },
        rewritten_code: reviewData.rewritten_code,
        score: reviewData.score,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Failed to save review");
    }

    return new Response(JSON.stringify({ reviewId: insertedReview.id, ...reviewData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("review-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
