/** Dark sidebar — conversation list + new chat button. */

import type { Conversation } from "../types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ conversations, activeId, onNew, onSelect, onDelete }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Chats</div>
        <button className="new-chat-btn" onClick={onNew}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New chat
        </button>
      </div>

      <ul className="conv-list">
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={`conv-item${conv.id === activeId ? " active" : ""}`}
            onClick={() => onSelect(conv.id)}
          >
            <span title={conv.title}>{conv.title}</span>
            <button
              className="conv-delete"
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
