"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../services/chat.service";
import { POLL_INTERVAL_MS } from "@/config/constants";

// Shared key so the query and mutations reference the same cache entry.
export const MESSAGES_QUERY_KEY = ["messages"] as const;

export function useMessages() {
  const { data, isLoading, isError } = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: () => fetchMessages(),
    refetchInterval: POLL_INTERVAL_MS, // polling, handled by React Query
  });

  return {
    messages: data ?? [],
    isLoading,
    error: isError ? "Could not load messages. Retrying…" : null,
  };
}