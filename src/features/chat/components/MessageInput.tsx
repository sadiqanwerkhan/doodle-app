"use client";

import { useRef, useState, KeyboardEvent } from "react";

interface MessageInputProps {
  onSend: (text: string) => Promise<unknown>;
  isSending: boolean;
}

// Sends on button click or Enter. Shift+Enter is reserved for newline.
export function MessageInput({ onSend, isSending }: MessageInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    setValue("");
    await onSend(trimmed);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-chat-blue p-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message"
        disabled={isSending}
        maxLength={500}
        aria-label="Type a message"
        className="flex-1 rounded-l bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-60"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || isSending}
        aria-label="Send message"
        className="rounded-r bg-chat-send px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSending ? "…" : "Send"}
      </button>
    </div>
  );
}