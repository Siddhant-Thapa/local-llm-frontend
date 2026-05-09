/** API client — typed wrappers around fetch for all backend endpoints. */

import type { ChatRequest, Conversation, Message } from "../types";

const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function getConversations(): Promise<Conversation[]> {
  const data = await apiFetch<{ items: Conversation[] }>("/conversations");
  return data.items;
}

export async function createConversation(title = "New conversation"): Promise<Conversation> {
  return apiFetch<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function deleteConversation(id: string): Promise<void> {
  await apiFetch<void>(`/conversations/${id}`, { method: "DELETE" });
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return apiFetch<Message[]>(`/conversations/${conversationId}/messages`);
}

/**
 * Streams the assistant response for a chat request.
 * Yields each token string as it arrives from the SSE endpoint.
 * Throws if the server returns a non-200 status.
 */
export async function* streamChat(
  request: ChatRequest,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  if (!res.body) {
    throw new Error("Response body is null");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by double newline
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data: ")) continue;

        const payload = line.slice("data: ".length);
        if (payload === "[DONE]") return;

        try {
          const parsed = JSON.parse(payload) as { token?: string; error?: string };
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.token) yield parsed.token;
        } catch {
          // Malformed SSE line — skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
