/** Scrollable list of chat messages — scrolls to bottom when new messages arrive. */

import { useEffect, useRef } from "react";
import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        Start a conversation
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1;
        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isLast && isStreaming && msg.role === "assistant"}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
