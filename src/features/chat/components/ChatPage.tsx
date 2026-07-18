"use client";

import { ChatFeed } from "./ChatFeed";
import { MessageInput } from "./MessageInput";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";

export function ChatPage() {
  const { messages, isLoading, error } = useMessages();
  const { send, isSending, sendError } = useSendMessage();

  return (
    <main className="mx-auto flex h-[100dvh] max-w-3xl flex-col overflow-hidden bg-[#f0f0f0] bg-[url('/doodle-bg.png')] bg-[length:400px_400px] bg-repeat">
      <ChatFeed
        messages={messages}
        isLoading={isLoading}
        error={error ?? sendError}
      />
      <MessageInput onSend={send} isSending={isSending} />
    </main>
  );
}