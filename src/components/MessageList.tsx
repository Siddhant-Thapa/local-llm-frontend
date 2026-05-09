/** Scrollable message list — auto-scrolls only when user is near the bottom. */

import { useEffect, useRef } from "react";
import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageCount = useRef(0);

  const isNearBottom = () => {
    const el = listRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  useEffect(() => {
    const newMessageArrived = messages.length !== messageCount.current;
    messageCount.current = messages.length;

    // Always scroll on a new message (user just sent, or assistant reply started)
    // During streaming, only follow if user hasn't scrolled away
    if (newMessageArrived || isNearBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const visible = messages.filter((m) => m.role !== "system");

  if (visible.length === 0) {
    return (
      <div className="message-list" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <p>How can I help you today?</p>
          <small>Powered by TinyLlama 1.1B running on EC2</small>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list" ref={listRef}>
      <div className="message-list-inner">
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
    </div>
  );
}
