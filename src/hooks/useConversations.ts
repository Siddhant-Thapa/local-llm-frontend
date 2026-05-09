/** Hook that manages the list of conversations and the currently active one. */

import { useCallback, useEffect, useState } from "react";
import {
  createConversation,
  deleteConversation,
  getConversations,
} from "../api/chat";
import type { Conversation } from "../types";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    getConversations()
      .then((list) => {
        setConversations(list);
        if (list.length > 0 && !activeId) {
          setActiveId(list[0].id);
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load conversations", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNew = useCallback(async () => {
    const conv = await createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  }, []);

  const remove = useCallback(
    async (id: string) => {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId((prev) => {
          const remaining = conversations.filter((c) => c.id !== id);
          return remaining.length > 0 ? remaining[0].id : null;
        });
      }
    },
    [activeId, conversations],
  );

  const setActive = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return { conversations, activeId, createNew, remove, setActive };
}
