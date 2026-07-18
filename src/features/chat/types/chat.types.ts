export interface Message {
  _id: string;
  message: string;
  author: string;
  createdAt: string; // ISO 8601
}

export interface SendMessagePayload {
  message: string;
  author: string;
}

export interface FetchMessagesParams {
  after?: string;
  limit?: number;
}