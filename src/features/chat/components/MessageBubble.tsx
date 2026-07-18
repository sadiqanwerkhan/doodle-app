import { formatMessageDate } from "../utils/formatDate";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities";
import type { Message } from "../types/chat.types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

// Own messages: right-aligned, yellow. Others: left-aligned, white with author name.
export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div
      className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}
      role="listitem"
    >
      <div
        className={`max-w-[75%] rounded-lg px-4 py-3 shadow-sm ${
          isOwn ? "bg-chat-own-bg" : "bg-chat-other-bg"
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-xs font-medium text-gray-400">
            {message.author}
          </p>
        )}

        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
          {decodeHtmlEntities(message.message)}
        </p>

        <p
          className={`mt-1 text-xs text-gray-400 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {formatMessageDate(message.createdAt)}
        </p>
      </div>
    </div>
  );
}