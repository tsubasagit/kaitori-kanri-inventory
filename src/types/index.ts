export type { Item, ItemStatus, ItemCondition } from "./item";
export type { Customer, CustomerType, IdentityDocumentType } from "./customer";
export type {
  Transaction,
  TransactionType,
  TransactionItem,
  PaymentMethod,
} from "./transaction";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
};
