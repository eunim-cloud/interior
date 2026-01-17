import { supabase } from './supabase';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  usage?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

/**
 * Gemini 챗봇에 메시지를 전송하고 응답을 받습니다.
 * @param message 사용자 메시지
 * @param history 대화 히스토리 (선택)
 * @param context 추가 컨텍스트 정보 (선택, 예: 현재 보고 있는 현장 정보)
 */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = [],
  context?: string
): Promise<ChatResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: {
        message,
        history,
        context,
      },
    });

    if (error) {
      console.error('Supabase function error:', error);
      return {
        success: false,
        error: error.message || '챗봇 서비스에 연결할 수 없습니다.',
      };
    }

    return data as ChatResponse;
  } catch (err) {
    console.error('Chat service error:', err);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

/**
 * 대화 히스토리에 메시지를 추가합니다.
 */
export function addToHistory(
  history: ChatMessage[],
  role: 'user' | 'model',
  text: string
): ChatMessage[] {
  return [
    ...history,
    {
      role,
      parts: [{ text }],
    },
  ];
}

/**
 * 현장 관련 컨텍스트를 생성합니다.
 */
export function createSiteContext(site?: {
  name?: string;
  status?: string;
  totalRevenue?: number;
  totalExpense?: number;
}): string | undefined {
  if (!site) return undefined;
  
  const parts: string[] = [];
  if (site.name) parts.push(`현장명: ${site.name}`);
  if (site.status) parts.push(`상태: ${site.status}`);
  if (site.totalRevenue !== undefined) {
    parts.push(`총 수입: ${site.totalRevenue.toLocaleString()}원`);
  }
  if (site.totalExpense !== undefined) {
    parts.push(`총 지출: ${site.totalExpense.toLocaleString()}원`);
  }
  
  return parts.length > 0 ? parts.join(', ') : undefined;
}
