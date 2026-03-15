"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { ItemCondition } from "@/types";
import { CATEGORIES, SIZES, COLORS, POPULAR_BRANDS } from "@/constants/categories";
import { CONDITION_LABELS } from "@/constants/statuses";
import { CameraCapture } from "@/components/purchase/CameraCapture";
import { QRScanner } from "@/components/purchase/QRScanner";

type ItemFormData = {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  size: string;
  color: string;
  condition: ItemCondition;
  purchasePrice: number;
  sellingPrice: number;
  photos: string[];
  scannedCode: string;
};

type ItemFormProps = {
  initialData?: Partial<ItemFormData>;
  onSubmit: (data: ItemFormData) => Promise<void>;
  loading?: boolean;
  showCamera?: boolean;
};

export function ItemForm({ initialData, onSubmit, loading, showCamera = true }: ItemFormProps) {
  const [form, setForm] = useState<ItemFormData>({
    name: initialData?.name ?? "",
    brand: initialData?.brand ?? "",
    category: initialData?.category ?? "",
    subcategory: initialData?.subcategory ?? "",
    size: initialData?.size ?? "",
    color: initialData?.color ?? "",
    condition: initialData?.condition ?? "B",
    purchasePrice: initialData?.purchasePrice ?? 0,
    sellingPrice: initialData?.sellingPrice ?? 0,
    photos: initialData?.photos ?? [],
    scannedCode: initialData?.scannedCode ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategory = CATEGORIES.find((c) => c.value === form.category);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "商品名を入力してください";
    if (!form.category) newErrors.category = "カテゴリを選択してください";
    if (form.sellingPrice < 0) newErrors.sellingPrice = "正しい価格を入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const update = (field: keyof ItemFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* カメラ・QRコード セクション */}
      {showCamera && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <CameraCapture
              photos={form.photos}
              onCapture={(dataUrl) =>
                update("photos", [...form.photos, dataUrl])
              }
              onRemove={(idx) =>
                update("photos", form.photos.filter((_, i) => i !== idx))
              }
            />
          </div>
          <div className="rounded-lg border border-border p-4">
            <QRScanner
              onScan={(value) => {
                update("scannedCode", value);
                if (!form.name) {
                  update("name", value);
                }
              }}
            />
            {form.scannedCode && (
              <div className="mt-2">
                <p className="text-xs text-secondary">読み取り済みコード</p>
                <p className="font-mono text-sm text-foreground">{form.scannedCode}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Input
        label="商品名"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
        placeholder="Levi's 501 デニムパンツ"
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-foreground">ブランド</label>
          <input
            list="brand-list"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="ブランドを入力..."
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground placeholder:text-secondary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <datalist id="brand-list">
            {POPULAR_BRANDS.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>
        <Select
          label="コンディション"
          value={form.condition}
          onChange={(e) => update("condition", e.target.value as ItemCondition)}
          options={Object.entries(CONDITION_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="カテゴリ"
          value={form.category}
          onChange={(e) => {
            update("category", e.target.value);
            update("subcategory", "");
          }}
          options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          placeholder="選択してください"
          error={errors.category}
        />
        <Select
          label="サブカテゴリ"
          value={form.subcategory}
          onChange={(e) => update("subcategory", e.target.value)}
          options={
            selectedCategory
              ? selectedCategory.subcategories.map((s) => ({ value: s, label: s }))
              : []
          }
          placeholder="選択してください"
          disabled={!form.category}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="サイズ"
          value={form.size}
          onChange={(e) => update("size", e.target.value)}
          options={SIZES.map((s) => ({ value: s, label: s }))}
          placeholder="選択"
        />
        <Select
          label="カラー"
          value={form.color}
          onChange={(e) => update("color", e.target.value)}
          options={COLORS.map((c) => ({ value: c, label: c }))}
          placeholder="選択"
        />
        <div />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="買取価格（税込）"
          type="number"
          value={form.purchasePrice || ""}
          onChange={(e) => update("purchasePrice", Number(e.target.value))}
          placeholder="0"
          min={0}
        />
        <Input
          label="販売価格（税込）"
          type="number"
          value={form.sellingPrice || ""}
          onChange={(e) => update("sellingPrice", Number(e.target.value))}
          error={errors.sellingPrice}
          placeholder="0"
          min={0}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={loading}>
          保存
        </Button>
      </div>
    </form>
  );
}

export type { ItemFormData };
