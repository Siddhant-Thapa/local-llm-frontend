/** Shared TypeScript types for the LLM Chat frontend. */

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokenCount: number | null;
  createdAt: string;
}

export interface ChatRequest {
  conversationId: string;
  content: string;
}

export type StreamStatus = "idle" | "streaming" | "error";
