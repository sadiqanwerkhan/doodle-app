export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const AUTH_TOKEN =
  process.env.NEXT_PUBLIC_AUTH_TOKEN ?? "super-secret-doodle-token";

export const CURRENT_USER =
  process.env.NEXT_PUBLIC_CURRENT_USER ?? "Me";

export const POLL_INTERVAL_MS = 5_000;
export const MESSAGE_PAGE_LIMIT = 50;