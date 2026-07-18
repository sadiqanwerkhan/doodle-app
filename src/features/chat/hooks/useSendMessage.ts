"use client";

import { useCallback, useState } from "react";
import { sendMessage } from "../services/chat.service";
import type { Message } from "../types/chat.types";
import { CURRENT_USER } from "@/config/constants";

interface UseSendMessageReturn {
  send: (text: string) => Promise<Message | null>;
  isSending: boolean;
  sendError: string | null;
}

export function useSendMessage(
  onOptimisticAdd: (msg: Message) => void,
  onOptimisticRollback: (tempId: string) => void
): UseSendMessageReturn {
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string): Promise<Message | null> => {
      const trimmed = text.trim();
      if (!trimmed) return null;

      // Show the message instantly with a temp id, before the server confirms.
      const tempId = `temp-${Date.now()}`;
      const optimistic: Message = {
        _id: tempId,
        message: trimmed,
        author: CURRENT_USER,
        createdAt: new Date().toISOString(),
      };

      onOptimisticAdd(optimistic);
      setIsSending(true);
      setSendError(null);

      try {
        const confirmed = await sendMessage({
          message: trimmed,
          author: CURRENT_USER,
        });
        // Drop the temp copy; the next poll brings the real one (with its real _id).
        onOptimisticRollback(tempId);
        return confirmed;
      } catch {
        onOptimisticRollback(tempId); // roll back so we don't show a message that never sent
        setSendError("Failed to send. Please try again.");
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [onOptimisticAdd, onOptimisticRollback]
  );

  return { send, isSending, sendError };
}