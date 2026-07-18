"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../types/chat.types";
import { CURRENT_USER } from "@/config/constants";

interface ChatFeedProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function ChatFeed({ messages, isLoading, error }: ChatFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message whenever the list changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-500">Loading messages…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-1 items-center justify-center"
        role="alert"
        aria-live="assertive"
      >
        <p className="rounded bg-white/80 px-4 py-2 text-sm text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-500">No messages yet. Say hello!</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwn={msg.author === CURRENT_USER}
        />
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}