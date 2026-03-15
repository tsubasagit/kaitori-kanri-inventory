import type { TransactionType } from "@/types";

export function generateReceiptNumber(
  type: TransactionType,
  date: Date,
  seq: number
): string {
  const prefix = type === "sale" ? "S" : "P";
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const seqStr = seq.toString().padStart(4, "0");
  return `${prefix}-${yyyy}${mm}${dd}-${seqStr}`;
}
