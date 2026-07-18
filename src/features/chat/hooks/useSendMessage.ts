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
  onOptimisticRollback: (tempId: string) => void,
  onSent: () => Promise<void>
): UseSendMessageReturn {
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string): Promise<Message | null> => {
      const trimmed = text.trim();
      if (!trimmed) return null;

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
        // Pull the server list immediately so the real message shows without waiting for the poll.
        // ChatPage removes the optimistic twin once the server copy is present.
        await onSent();
        return confirmed;
      } catch {
        onOptimisticRollback(tempId); // only roll back on failure
        setSendError("Failed to send. Please try again.");
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [onOptimisticAdd, onOptimisticRollback, onSent]
  );

  return { send, isSending, sendError };
}