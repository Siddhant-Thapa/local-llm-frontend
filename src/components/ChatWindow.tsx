/** Root layout — dark sidebar + main chat area. */

import { useEffect, useRef } from "react";
import { useChatStream } from "../hooks/useChatStream";
import { useConversations } from "../hooks/useConversations";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";

export function ChatWindow() {
  const { conversations, activeId, createNew, remove, setActive, refresh } = useConversations();
  const { messages, status, error, sendMessage } = useChatStream(activeId);
  const prevStatus = useRef(status);

  // Refresh the sidebar title as soon as streaming finishes
  useEffect(() => {
    if (prevStatus.current === "streaming" && status === "idle") {
      refresh();
    }
    prevStatus.current = status;
  }, [status, refresh]);

  return (
    <div className="app-shell">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNew={createNew}
        onSelect={setActive}
        onDelete={remove}
      />
      <div className="main">
        {error && <div className="error-bar">{error}</div>}
        <MessageList messages={messages} isStreaming={status === "streaming"} />
        <ChatInput onSend={sendMessage} disabled={status === "streaming" || !activeId} />
      </div>
    </div>
  );
}
