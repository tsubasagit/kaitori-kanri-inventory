"use client";

import { Button } from "@/components/ui";
import { Item } from "@/types";
import { formatCurrency } from "@/utils/currency";

type CartProps = {
  items: Item[];
  onRemove: (itemId: string) => void;
};

export function Cart({ items, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.sellingPrice, 0);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <p className="text-sm text-secondary">カートに商品がありません</p>
        <p className="mt-1 text-xs text-secondary">左の検索から商品を追加してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg bg-muted p-3"
        >
          <div>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-secondary">{item.brand} / {item.barcode}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">{formatCurrency(item.sellingPrice)}</p>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-danger hover:text-danger/80"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="font-medium">{items.length}点</p>
        <p className="text-xl font-bold text-primary">{formatCurrency(total)}</p>
      </div>
    </div>
  );
}
