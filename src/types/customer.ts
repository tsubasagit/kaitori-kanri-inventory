export type CustomerType = "seller" | "buyer" | "both";

export type IdentityDocumentType =
  | "drivers_license"
  | "passport"
  | "my_number"
  | "insurance_card"
  | "residence_card"
  | "other";

export type Customer = {
  id: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  phone: string;
  address: string;
  identityVerified: boolean;
  identityDocumentType: IdentityDocumentType | "";
  identityVerifiedAt: Date | null;
  customerType: CustomerType;
  totalSellCount: number;
  totalBuyCount: number;
  totalSellAmount: number;
  totalBuyAmount: number;
  note: string;
  createdAt: Date;
  updatedAt: Date;
};
