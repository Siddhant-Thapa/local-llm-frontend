/** Sidebar — lists conversations, highlights the active one, has a "New chat" button. */

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
    <aside
      style={{
        width: "260px",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        background: "#fafafa",
      }}
    >
      <div style={{ padding: "12px" }}>
        <button
          onClick={onNew}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          + New chat
        </button>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, overflowY: "auto", flex: 1 }}>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              cursor: "pointer",
              background: conv.id === activeId ? "#e8f0fe" : "transparent",
              fontWeight: conv.id === activeId ? 600 : 400,
              borderLeft: conv.id === activeId ? "3px solid #0070f3" : "3px solid transparent",
            }}
            onClick={() => onSelect(conv.id)}
          >
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {conv.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              title="Delete conversation"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#999",
                fontSize: "1rem",
                padding: "0 4px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
