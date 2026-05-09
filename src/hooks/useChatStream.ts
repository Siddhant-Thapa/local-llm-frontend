/** Hook that manages messages for one conversation and drives the SSE stream. */

import { useCallback, useEffect, useRef, useState } from "react";
import { getMessages, streamChat } from "../api/chat";
import type { Message, StreamStatus } from "../types";

export function useChatStream(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load message history whenever the active conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    getMessages(conversationId)
      .then((msgs) => {
        if (!cancelled) setMessages(msgs);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load messages");
      });

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // Abort any in-flight stream when the component unmounts
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || status === "streaming") return;

      // Optimistically append the user message
      const optimisticUser: Message = {
        id: crypto.randomUUID(),
        conversationId,
        role: "user",
        content,
        tokenCount: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUser]);
      setStatus("streaming");
      setError(null);

      // Placeholder assistant message that grows token by token
      const assistantId = crypto.randomUUID();
      const placeholder: Message = {
        id: assistantId,
        conversationId,
        role: "assistant",
        content: "",
        tokenCount: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, placeholder]);

      abortRef.current = new AbortController();

      try {
        const generator = streamChat({ conversationId, content }, abortRef.current.signal);
        for await (const token of generator) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + token } : m,
            ),
          );
        }
        setStatus("idle");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          setStatus("idle");
          return;
        }
        const msg = err instanceof Error ? err.message : "Stream error";
        setError(msg);
        setStatus("error");
      }
    },
    [conversationId, status],
  );

  return { messages, status, error, sendMessage };
}
