/** Root layout component — composes Sidebar, MessageList, and ChatInput. */

import { useChatStream } from "../hooks/useChatStream";
import { useConversations } from "../hooks/useConversations";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";

export function ChatWindow() {
  const { conversations, activeId, createNew, remove, setActive } = useConversations();
  const { messages, status, error, sendMessage } = useChatStream(activeId);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNew={createNew}
        onSelect={setActive}
        onDelete={remove}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {error && (
          <div style={{ background: "#fee", padding: "8px 16px", color: "#c00" }}>
            {error}
          </div>
        )}
        <MessageList messages={messages} isStreaming={status === "streaming"} />
        <ChatInput onSend={sendMessage} disabled={status === "streaming" || !activeId} />
      </div>
    </div>
  );
}
