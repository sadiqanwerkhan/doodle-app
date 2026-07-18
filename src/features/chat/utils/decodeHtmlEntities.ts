// Backend stores some text HTML-encoded (e.g. It&#39;s). Decode for display.
export function decodeHtmlEntities(text: string): string {
  if (typeof window === "undefined") return text; // SSR guard
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}