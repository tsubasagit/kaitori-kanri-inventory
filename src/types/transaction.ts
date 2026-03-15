export type TransactionType = "purchase" | "sale";
export type PaymentMethod = "cash" | "credit_card" | "electronic_money" | "qr_payment";

export type TransactionItem = {
  itemId: string;
  itemName: string;
  brand: string;
  price: number;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  customerId: string;
  customerName: string;
  items: TransactionItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  change: number;
  staffId: string;
  staffName: string;
  receiptNumber: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
};
