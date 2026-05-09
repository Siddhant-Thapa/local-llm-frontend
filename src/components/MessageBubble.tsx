/** Renders a single chat message with role-appropriate styling. */

import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  isStreaming: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  user: {
    alignSelf: "flex-end",
    background: "#0070f3",
    color: "#fff",
    borderRadius: "12px 12px 0 12px",
    maxWidth: "70%",
    padding: "10px 14px",
    margin: "4px 0",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  assistant: {
    alignSelf: "flex-start",
    background: "#f3f3f3",
    color: "#111",
    borderRadius: "12px 12px 12px 0",
    maxWidth: "70%",
    padding: "10px 14px",
    margin: "4px 0",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  system: {
    alignSelf: "center",
    background: "#fffbe6",
    color: "#555",
    borderRadius: "8px",
    maxWidth: "80%",
    padding: "6px 12px",
    margin: "4px 0",
    fontSize: "0.85em",
    whiteSpace: "pre-wrap",
  },
};

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const style = styles[message.role] ?? styles.assistant;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={style}>
        {message.content}
        {isStreaming && (
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "14px",
              background: "currentColor",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              animation: "blink 1s step-start infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}
