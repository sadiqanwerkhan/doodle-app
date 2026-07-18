import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import type { Message } from "@/features/chat/types/chat.types";

const message: Message = {
  _id: "1",
  message: "Hello there!",
  author: "Alice",
  createdAt: "2018-03-10T09:55:00", // local time → stable across timezones
};

describe("MessageBubble", () => {
  it("shows author name for others' messages", () => {
    render(<MessageBubble message={message} isOwn={false} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("hides author name for own messages", () => {
    render(<MessageBubble message={message} isOwn={true} />);
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("renders text and formatted timestamp", () => {
    render(<MessageBubble message={message} isOwn={false} />);
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
    expect(screen.getByText("10 Mar 2018 9:55")).toBeInTheDocument();
  });

  it("decodes HTML entities in the message body", () => {
    render(
      <MessageBubble
        message={{ ...message, message: "It&#39;s working" }}
        isOwn={false}
      />
    );
    expect(screen.getByText("It's working")).toBeInTheDocument();
  });
});