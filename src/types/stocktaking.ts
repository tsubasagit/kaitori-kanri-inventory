export type StocktakingStatus = "open" | "closed";
export type StocktakingScope = "full" | "category";

export type ScannedItem = {
  itemId: string;
  barcode: string;
  itemName: string;
  brand: string;
  scannedAt: Date;
  scannedBy: string;
};

export type StocktakingReport = {
  systemCount: number;
  scannedCount: number;
  matchedCount: number;
  missingItems: { itemId: string; barcode: string; name: string; brand: string; sellingPrice: number }[];
  unknownBarcodes: string[];
};

export type StocktakingSession = {
  id: string;
  status: StocktakingStatus;
  scope: StocktakingScope;
  targetCategory: string;
  startedBy: string;
  scannedItems: ScannedItem[];
  report: StocktakingReport | null;
  note: string;
  createdAt: Date;
  closedAt: Date | null;
};
