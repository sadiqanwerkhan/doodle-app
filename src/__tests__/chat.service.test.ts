import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMessages, sendMessage } from "@/features/chat/services/chat.service";
import apiClient from "@/lib/apiClient";

vi.mock("@/lib/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedClient = vi.mocked(apiClient, true);

beforeEach(() => vi.clearAllMocks());

describe("fetchMessages", () => {
  it("returns the raw array from the API", async () => {
    const data = [
      { _id: "1", message: "hi", author: "Alice", createdAt: "2024-01-01T10:00:00Z" },
    ];
    mockedClient.get.mockResolvedValueOnce({ data });

    const result = await fetchMessages();

    expect(result).toEqual(data);
  });

  it("hits the correct endpoint", async () => {
    mockedClient.get.mockResolvedValueOnce({ data: [] });
    await fetchMessages();
    expect(mockedClient.get).toHaveBeenCalledWith("/api/v1/messages", expect.any(Object));
  });

  it("passes after and limit when provided", async () => {
    mockedClient.get.mockResolvedValueOnce({ data: [] });
    await fetchMessages({ after: "2024-01-01T00:00:00Z" });
    expect(mockedClient.get).toHaveBeenCalledWith("/api/v1/messages", {
      params: { after: "2024-01-01T00:00:00Z", limit: 50 },
    });
  });

  it("returns an empty array when the API returns nothing", async () => {
    mockedClient.get.mockResolvedValueOnce({ data: null });
    expect(await fetchMessages()).toEqual([]);
  });
});

describe("sendMessage", () => {
  it("posts the payload and returns the created message", async () => {
    const payload = { message: "Hello", author: "Alice" };
    const created = { _id: "2", ...payload, createdAt: "2024-01-01T10:02:00Z" };
    mockedClient.post.mockResolvedValueOnce({ data: created });

    const result = await sendMessage(payload);

    expect(mockedClient.post).toHaveBeenCalledWith("/api/v1/messages", payload);
    expect(result).toEqual(created);
  });
});