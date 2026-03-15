export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${dateStr} ${h}:${min}`;
}

export function toDateSafe(val: unknown): Date {
  if (!val) return new Date();
  if (typeof (val as { toDate?: () => Date }).toDate === "function") {
    return (val as { toDate: () => Date }).toDate();
  }
  if (typeof val === "string" || typeof val === "number") return new Date(val);
  return new Date();
}

export function getDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
