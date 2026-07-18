import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageInput } from "@/features/chat/components/MessageInput";

describe("MessageInput", () => {
  it("calls onSend with typed text on button click", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    render(<MessageInput onSend={onSend} isSending={false} />);

    await userEvent.type(screen.getByLabelText("Type a message"), "Hello");
    await userEvent.click(screen.getByLabelText("Send message"));

    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("sends on Enter key", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    render(<MessageInput onSend={onSend} isSending={false} />);

    await userEvent.type(screen.getByLabelText("Type a message"), "Hi{Enter}");

    expect(onSend).toHaveBeenCalledWith("Hi");
  });

  it("does not send empty or whitespace-only messages", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    render(<MessageInput onSend={onSend} isSending={false} />);

    await userEvent.type(screen.getByLabelText("Type a message"), "   {Enter}");

    expect(onSend).not.toHaveBeenCalled();
  });

  it("disables the button while sending", () => {
    render(<MessageInput onSend={vi.fn()} isSending={true} />);
    expect(screen.getByLabelText("Send message")).toBeDisabled();
  });
});