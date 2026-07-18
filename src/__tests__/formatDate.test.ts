import { describe, it, expect } from "vitest";
import { formatMessageDate } from "@/features/chat/utils/formatDate";

describe("formatMessageDate", () => {
  it("formats an ISO string to the display format", () => {
    expect(formatMessageDate("2018-03-10T09:55:00")).toBe("10 Mar 2018 9:55");
  });

  it("does not zero-pad single-digit hours", () => {
    expect(formatMessageDate("2018-03-10T09:05:00")).toBe("10 Mar 2018 9:05");
  });

  it("returns the original string when parsing fails", () => {
    expect(formatMessageDate("not-a-date")).toBe("not-a-date");
  });
});