import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";
import { MESSAGES_QUERY_KEY } from "@/features/chat/hooks/useMessages";
import * as chatService from "@/features/chat/services/chat.service";
import type { Message } from "@/features/chat/types/chat.types";

vi.mock("@/features/chat/services/chat.service");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
}

beforeEach(() => vi.clearAllMocks());

describe("useSendMessage", () => {
    it("optimistically adds the message to the cache before the server responds", async () => {
        const created: Message = {
        _id: "server-1",
         message: "Hello",
        author: "Me",
        createdAt: "2024-01-01T10:00:00Z",
        };
        vi.mocked(chatService.sendMessage).mockResolvedValueOnce(created);
        vi.mocked(chatService.fetchMessages).mockResolvedValue([created]);

        const { wrapper, queryClient } = createWrapper();
        queryClient.setQueryData<Message[]>(MESSAGES_QUERY_KEY, []);

        const { result } = renderHook(() => useSendMessage(), { wrapper });

        act(() => {
      result.current.send("Hello");
        });

        // onMutate applies asynchronously, so poll until the optimistic message lands.
        await waitFor(() => {
      const cached = queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY);
      expect(cached).toHaveLength(1);
    });

    const cached = queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY);
    expect(cached?.[0].message).toBe("Hello");
    expect(cached?.[0]._id).toMatch(/^temp-/);
  });

  it("rolls back the optimistic message when the server call fails", async () => {
    vi.mocked(chatService.sendMessage).mockRejectedValueOnce(new Error("boom"));
    vi.mocked(chatService.fetchMessages).mockResolvedValue([]);

    const { wrapper, queryClient } = createWrapper();
    queryClient.setQueryData<Message[]>(MESSAGES_QUERY_KEY, []);

    const { result } = renderHook(() => useSendMessage(), { wrapper });

    act(() => {
      result.current.send("Will fail");
    });

    // Rolls back to the previous (empty) cache after the error.
    await waitFor(() => {
      const cached = queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY);
      expect(cached).toEqual([]);
    });
  });

  it("ignores empty or whitespace-only messages", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useSendMessage(), { wrapper });

    act(() => {
      result.current.send("   ");
    });

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });
});