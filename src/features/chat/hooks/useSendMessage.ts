"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../services/chat.service";
import type { Message } from "../types/chat.types";
import { CURRENT_USER } from "@/config/constants";
import { MESSAGES_QUERY_KEY } from "./useMessages";

export function useSendMessage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (text: string) =>
      sendMessage({ message: text.trim(), author: CURRENT_USER }),

    // Optimistically add the message before the server responds.
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: MESSAGES_QUERY_KEY });

      const previous =
        queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY) ?? [];

      const optimistic: Message = {
        _id: `temp-${Date.now()}`,
        message: text.trim(),
        author: CURRENT_USER,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(MESSAGES_QUERY_KEY, [
        ...previous,
        optimistic,
      ]);

      // Return context for rollback on error.
      return { previous };
    },

    // On failure, restore the previous cache.
    onError: (_err, _text, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MESSAGES_QUERY_KEY, context.previous);
      }
    },

    // After success or failure, refetch to sync with the server (replaces the temp message with the real one).
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });

  const send = (text: string) => {
    if (!text.trim()) return;
    mutation.mutate(text);
  };

  return { send, isSending: mutation.isPending, sendError: mutation.isError ? "Failed to send. Please try again." : null };
}