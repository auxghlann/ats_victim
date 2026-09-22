/**
 * Formats a date string into a human-readable relative time (e.g. "Today", "Yesterday", "3 days ago", "1 week ago", "1 month ago").
 */
export function formatRelativeDate(dateInput: string | null | undefined): string {
  if (!dateInput) return "No activity";

  const targetDate = new Date(dateInput);
  if (isNaN(targetDate.getTime())) return String(dateInput);

  const now = new Date();
  // Normalize both to start of day in local time for accurate day-difference calculation
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const diffMs = today - targetDay;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 14) {
    return "1 week ago";
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  }
  if (diffDays < 60) {
    return "1 month ago";
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} months ago`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

/**
 * Formats a Date or date string to YYYY-MM-DD in local time.
 */
export function toLocalDateString(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Formats a Date or date string to YYYY-MM-DDTHH:mm in local time for datetime-local inputs.
 */
export function toLocalDatetimeString(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a local datetime string (e.g. from input[type="datetime-local"]) to an ISO 8601 UTC string.
 */
export function toIsoUtcString(localDatetimeStr: string): string {
  if (!localDatetimeStr) return "";
  const d = new Date(localDatetimeStr);
  return !isNaN(d.getTime()) ? d.toISOString() : localDatetimeStr;
}
