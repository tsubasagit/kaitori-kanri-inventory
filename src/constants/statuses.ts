import type { ItemStatus, ItemCondition, PaymentMethod, TransactionType, CustomerType, IdentityDocumentType, StocktakingStatus, StocktakingScope } from "@/types";

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  in_stock: "在庫あり",
  sold: "販売済み",
  returned: "返品",
  disposed: "廃棄",
};

export const ITEM_STATUS_COLORS: Record<ItemStatus, { color: string; bgColor: string }> = {
  in_stock: { color: "var(--success)", bgColor: "var(--success-light)" },
  sold: { color: "var(--primary)", bgColor: "var(--primary-light)" },
  returned: { color: "var(--warning)", bgColor: "var(--warning-light)" },
  disposed: { color: "var(--danger)", bgColor: "var(--danger-light)" },
};

export const CONDITION_LABELS: Record<ItemCondition, string> = {
  S: "S（新品同様）",
  A: "A（美品）",
  B: "B（良好）",
  C: "C（使用感あり）",
  D: "D（難あり）",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "現金",
  credit_card: "クレジットカード",
  electronic_money: "電子マネー",
  qr_payment: "QR決済",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  purchase: "買取",
  sale: "販売",
};

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  seller: "売り手",
  buyer: "買い手",
  both: "両方",
};

export const IDENTITY_DOCUMENT_LABELS: Record<IdentityDocumentType, string> = {
  drivers_license: "運転免許証",
  passport: "パスポート",
  my_number: "マイナンバーカード",
  insurance_card: "健康保険証",
  residence_card: "在留カード",
  other: "その他",
};

export const STOCKTAKING_STATUS_LABELS: Record<StocktakingStatus, string> = {
  open: "実施中",
  closed: "完了",
};

export const STOCKTAKING_STATUS_COLORS: Record<StocktakingStatus, { color: string; bgColor: string }> = {
  open: { color: "var(--warning)", bgColor: "var(--warning-light)" },
  closed: { color: "var(--success)", bgColor: "var(--success-light)" },
};

export const STOCKTAKING_SCOPE_LABELS: Record<StocktakingScope, string> = {
  full: "全品棚卸",
  category: "カテゴリ別",
};
