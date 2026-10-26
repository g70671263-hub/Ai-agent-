import { PlanResponse } from '../types';

export async function requestActionPlan(
  prompt: string,
  attachments: { name: string; type: string; mimeType: string; data: string }[] = [],
  deviceContext: Record<string, any> = {},
  modelBrain: string = 'gemini-3.8-flash'
): Promise<PlanResponse> {
  const response = await fetch('/api/gemini/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      attachments,
      deviceContext,
      modelBrain,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with ${response.status}`);
  }

  return response.json();
}

export async function executeCodeOnDevice(
  code: string,
  language: string = 'javascript'
): Promise<{ success: boolean; logs: string; returnValue?: any; executionTimeMs?: number; error?: string }> {
  const response = await fetch('/api/gemini/execute-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error(`Execution error: ${response.status}`);
  }

  return response.json();
}

export async function browseWebOnDevice(
  url?: string,
  query?: string
): Promise<{
  success: boolean;
  url: string;
  pageTitle: string;
  summary: string;
  keyDataPoints: string[];
  simulatedElements: string[];
}> {
  const response = await fetch('/api/gemini/browse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      query,
    }),
  });

  if (!response.ok) {
    throw new Error(`Browser automation error: ${response.status}`);
  }

  return response.json();
}

export async function fetchServerStatus() {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
