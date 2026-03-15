"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { ItemCondition } from "@/types";
import { CATEGORIES, SIZES, COLORS } from "@/constants/categories";
import { CONDITION_LABELS } from "@/constants/statuses";

export type AppraisalItem = {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  size: string;
  color: string;
  condition: ItemCondition;
  purchasePrice: number;
  sellingPrice: number;
};

type AppraisalStepProps = {
  items: AppraisalItem[];
  onAdd: (item: AppraisalItem) => void;
  onRemove: (index: number) => void;
  onNext: () => void;
};

const emptyItem: AppraisalItem = {
  name: "",
  brand: "",
  category: "",
  subcategory: "",
  size: "",
  color: "",
  condition: "B",
  purchasePrice: 0,
  sellingPrice: 0,
};

export function AppraisalStep({ items, onAdd, onRemove, onNext }: AppraisalStepProps) {
  const [current, setCurrent] = useState<AppraisalItem>({ ...emptyItem });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategory = CATEGORIES.find((c) => c.value === current.category);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!current.name) newErrors.name = "商品名を入力してください";
    if (!current.category) newErrors.category = "カテゴリを選択してください";
    if (current.purchasePrice <= 0) newErrors.purchasePrice = "買取価格を入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAdd(current);
    setCurrent({ ...emptyItem });
    setErrors({});
  };

  const total = items.reduce((sum, item) => sum + item.purchasePrice, 0);

  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <div className="rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            査定済み商品（{items.length}点）
          </h3>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-muted p-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-secondary">
                    {item.brand} / {CONDITION_LABELS[item.condition]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-primary">
                    ¥{item.purchasePrice.toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="text-danger hover:text-danger/80"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <p className="text-sm font-medium">買取合計</p>
            <p className="text-lg font-bold text-primary">¥{total.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-medium text-foreground">商品を追加</h3>
        <div className="space-y-4">
          <Input
            label="商品名"
            value={current.name}
            onChange={(e) => setCurrent((p) => ({ ...p, name: e.target.value }))}
            error={errors.name}
            placeholder="Levi's 501 デニムパンツ"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ブランド"
              value={current.brand}
              onChange={(e) => setCurrent((p) => ({ ...p, brand: e.target.value }))}
              placeholder="ブランド名"
            />
            <Select
              label="コンディション"
              value={current.condition}
              onChange={(e) => setCurrent((p) => ({ ...p, condition: e.target.value as ItemCondition }))}
              options={Object.entries(CONDITION_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="カテゴリ"
              value={current.category}
              onChange={(e) => setCurrent((p) => ({ ...p, category: e.target.value, subcategory: "" }))}
              options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              placeholder="選択してください"
              error={errors.category}
            />
            <Select
              label="サブカテゴリ"
              value={current.subcategory}
              onChange={(e) => setCurrent((p) => ({ ...p, subcategory: e.target.value }))}
              options={selectedCategory ? selectedCategory.subcategories.map((s) => ({ value: s, label: s })) : []}
              placeholder="選択してください"
              disabled={!current.category}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="サイズ"
              value={current.size}
              onChange={(e) => setCurrent((p) => ({ ...p, size: e.target.value }))}
              options={SIZES.map((s) => ({ value: s, label: s }))}
              placeholder="選択"
            />
            <Select
              label="カラー"
              value={current.color}
              onChange={(e) => setCurrent((p) => ({ ...p, color: e.target.value }))}
              options={COLORS.map((c) => ({ value: c, label: c }))}
              placeholder="選択"
            />
            <div />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="買取価格（税込）"
              type="number"
              value={current.purchasePrice || ""}
              onChange={(e) => setCurrent((p) => ({ ...p, purchasePrice: Number(e.target.value) }))}
              error={errors.purchasePrice}
              min={0}
            />
            <Input
              label="販売予定価格（税込）"
              type="number"
              value={current.sellingPrice || ""}
              onChange={(e) => setCurrent((p) => ({ ...p, sellingPrice: Number(e.target.value) }))}
              min={0}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleAdd}>
              商品を追加
            </Button>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onNext}>確認画面へ</Button>
        </div>
      )}
    </div>
  );
}
