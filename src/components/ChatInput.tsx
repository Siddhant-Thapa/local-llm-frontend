/** Controlled textarea — submits on Enter, Shift+Enter inserts a newline. */

import { type KeyboardEvent, useCallback, useState } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  return (
    <div
      style={{
        padding: "12px 16px",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
      }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "Waiting…" : "Type a message (Enter to send)"}
        rows={3}
        style={{
          flex: 1,
          resize: "none",
          borderRadius: "8px",
          border: "1px solid #ccc",
          padding: "8px 12px",
          fontSize: "1rem",
          fontFamily: "inherit",
          outline: "none",
        }}
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        style={{
          padding: "8px 18px",
          borderRadius: "8px",
          border: "none",
          background: "#0070f3",
          color: "#fff",
          fontSize: "1rem",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        Send
      </button>
    </div>
  );
}
