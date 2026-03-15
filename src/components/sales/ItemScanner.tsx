"use client";

import { useState, useMemo } from "react";
import { Input, Badge } from "@/components/ui";
import { Item } from "@/types";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { CONDITION_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";

type ItemScannerProps = {
  items: Item[];
  onSelect: (item: Item) => void;
  cartItemIds: string[];
};

export function ItemScanner({ items, onSelect, cartItemIds }: ItemScannerProps) {
  const [search, setSearch] = useState("");

  const availableItems = useMemo(() => {
    return items.filter((i) => i.status === "in_stock" && !cartItemIds.includes(i.id));
  }, [items, cartItemIds]);

  const filtered = useMemo(() => {
    if (!search) return availableItems.slice(0, 10);
    const q = search.toLowerCase();
    return availableItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q) ||
        i.barcode.toLowerCase().includes(q)
    );
  }, [availableItems, search]);

  return (
    <div className="space-y-3">
      <Input
        placeholder="商品名・ブランド・バーコードで検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-80 space-y-2 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-4 text-center text-sm text-secondary">
            {search ? "該当する商品がありません" : "在庫がありません"}
          </p>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item);
                setSearch("");
              }}
              className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-secondary">
                    {item.brand} / {CONDITION_LABELS[item.condition]} / {item.size}
                  </p>
                  <p className="font-mono text-xs text-secondary">{item.barcode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(item.sellingPrice)}
                  </p>
                  <ItemStatusBadge status={item.status} />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
