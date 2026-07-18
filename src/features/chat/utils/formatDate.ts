import { format, parseISO } from "date-fns";

// "10 Mar 2018 9:55" — matches the design. Falls back to raw string if unparseable.
export function formatMessageDate(isoString: string): string {
  try {
    return format(parseISO(isoString), "d MMM yyyy H:mm");
  } catch {
    return isoString;
  }
}