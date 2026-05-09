/** Single message — user gets a pill bubble, assistant gets full-width plain text. */

import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  isStreaming: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  if (message.role === "system") return null;

  return (
    <div className={`message-row ${message.role}`}>
      {message.role === "assistant" && (
        <div className="message-label">Assistant</div>
      )}
      <div className="bubble">
        {message.content}
        {isStreaming && <span className="cursor" />}
      </div>
    </div>
  );
}
