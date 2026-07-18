import { describe, it, expect } from "vitest";
import { decodeHtmlEntities } from "@/features/chat/utils/decodeHtmlEntities";

describe("decodeHtmlEntities", () => {
  it("decodes a numeric apostrophe entity", () => {
    expect(decodeHtmlEntities("It&#39;s easy")).toBe("It's easy");
  });

  it("decodes named entities", () => {
    expect(decodeHtmlEntities("Tom &amp; Jerry")).toBe("Tom & Jerry");
  });

  it("leaves plain text unchanged", () => {
    expect(decodeHtmlEntities("hello world")).toBe("hello world");
  });
});