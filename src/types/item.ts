export type ItemStatus = "in_stock" | "sold" | "returned" | "disposed";
export type ItemCondition = "S" | "A" | "B" | "C" | "D";

export type Item = {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  size: string;
  color: string;
  condition: ItemCondition;
  purchasePrice: number;
  sellingPrice: number;
  customerId: string;
  purchaseTransactionId: string;
  photoUrls: string[];
  barcode: string;
  status: ItemStatus;
  registeredBy: string;
  createdAt: Date;
  updatedAt: Date;
};
