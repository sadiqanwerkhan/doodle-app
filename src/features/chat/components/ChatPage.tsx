"use client";

import { useCallback, useState } from "react";
import { ChatFeed } from "./ChatFeed";
import { MessageInput } from "./MessageInput";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import type { Message } from "../types/chat.types";

export function ChatPage() {
  const { messages, isLoading, error, refetch } = useMessages();

  const [optimistic, setOptimistic] = useState<Message[]>([]);

  const handleOptimisticAdd = useCallback((msg: Message) => {
    setOptimistic((prev) => [...prev, msg]);
  }, []);

  const handleOptimisticRollback = useCallback((tempId: string) => {
    setOptimistic((prev) => prev.filter((m) => m._id !== tempId));
  }, []);

  const { send, isSending, sendError } = useSendMessage(
    handleOptimisticAdd,
    handleOptimisticRollback,
    refetch
  );

  // Drop any optimistic message whose real twin (same author + text) has arrived from the server.
  const serverKeys = new Set(messages.map((m) => `${m.author}|${m.message}`));
  const pendingOptimistic = optimistic.filter(
    (m) => !serverKeys.has(`${m.author}|${m.message}`)
  );

  const allMessages = [...messages, ...pendingOptimistic];

  return (
    <main className="mx-auto flex h-[100dvh] max-w-3xl flex-col overflow-hidden bg-[#f0f0f0] bg-[url('/doodle-bg.png')] bg-[length:400px_400px] bg-repeat">
      <ChatFeed
        messages={allMessages}
        isLoading={isLoading}
        error={error ?? sendError}
      />
      <MessageInput onSend={send} isSending={isSending} />
    </main>
  );
}