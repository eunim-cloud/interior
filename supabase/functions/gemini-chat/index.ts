import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
  context?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Supabase secrets에서 API 키 읽기
    const GEMINI_API_KEY = Deno.env.get("GEMINY-KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINY-KEY not found in environment variables");
    }

    const { message, history = [], context } = await req.json() as RequestBody;

    if (!message) {
      throw new Error("Message is required");
    }

    // 시스템 컨텍스트 설정 - 인테리어 현장 관리 어시스턴트
    const systemInstruction = `당신은 SiteFlow의 AI 어시스턴트입니다. 
인테리어 현장 관리, 정산, 공정 관리에 대한 질문에 친절하고 전문적으로 답변해주세요.
한국어로 답변하며, 간결하고 실용적인 조언을 제공합니다.
${context ? `\n현재 컨텍스트: ${context}` : ""}`;

    // 대화 히스토리 구성
    const contents = [
      ...history,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // Gemini API 호출 (REST API 사용) - gemini-2.5-flash 모델 사용
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // 응답 텍스트 추출
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "죄송합니다. 응답을 생성하지 못했습니다.";

    return new Response(
      JSON.stringify({
        success: true,
        response: responseText,
        usage: data.usageMetadata,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
