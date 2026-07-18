"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMessages } from "../services/chat.service";
import type { Message } from "../types/chat.types";
import { POLL_INTERVAL_MS } from "@/config/constants";

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMessages(): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tracks IDs we've already rendered so polling doesn't add duplicates. O(1) per message.
  const knownIds = useRef(new Set<string>());

  const load = useCallback(async () => {
    try {
      const incoming = await fetchMessages();

      setMessages((prev) => {
        const next = [...prev];
        let changed = false;

        for (const msg of incoming) {
          if (!knownIds.current.has(msg._id)) {
            knownIds.current.add(msg._id);
            next.push(msg);
            changed = true;
          }
        }

        // Returning prev when nothing changed avoids an unnecessary re-render.
        return changed ? next : prev;
      });

      setError(null);
    } catch {
      setError("Could not load messages. Retrying…");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval); // cleanup prevents leaks/double-polling
  }, [load]);

  return { messages, isLoading, error, refetch: load };
}