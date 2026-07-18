import { formatMessageDate } from "../utils/formatDate";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities";
import type { Message } from "../types/chat.types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

// Spec (from design assets): bubble max-width 640px, 16px inner padding,
// 24px margin from the opposite screen edge. Own = right/yellow, others = left/white.
export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div
      className={`flex w-full ${isOwn ? "justify-end pl-6" : "justify-start pr-6"}`}
      role="listitem"
    >
      <div
        className={`w-fit max-w-[640px] rounded-lg p-4 shadow-sm ${
          isOwn ? "bg-chat-own-bg" : "bg-chat-other-bg"
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-sm font-normal text-chat-author">
            {message.author}
          </p>
        )}

        <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-gray-800">
          {decodeHtmlEntities(message.message)}
        </p>

        <p
          className={`mt-1 text-sm text-gray-400 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {formatMessageDate(message.createdAt)}
        </p>
      </div>
    </div>
  );
}