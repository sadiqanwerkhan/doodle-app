import apiClient from "@/lib/apiClient";
import { MESSAGE_PAGE_LIMIT } from "@/config/constants";
import type {
  Message,
  SendMessagePayload,
  FetchMessagesParams,
} from "../types/chat.types";

// GET returns a raw Message[] in ascending order (oldest first) by default.
export async function fetchMessages(
  params: FetchMessagesParams = {}
): Promise<Message[]> {
  const { after, limit = MESSAGE_PAGE_LIMIT } = params;
  const query = after ? { after, limit } : { limit };

  const { data } = await apiClient.get<Message[]>("/api/v1/messages", {
    params: query,
  });

  return data ?? [];
}

// POST returns 201 with the created Message.
export async function sendMessage(
  payload: SendMessagePayload
): Promise<Message> {
  const { data } = await apiClient.post<Message>("/api/v1/messages", payload);
  return data;
}