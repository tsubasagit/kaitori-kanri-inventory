"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { Customer, CustomerType, IdentityDocumentType } from "@/types";
import { CUSTOMER_TYPE_LABELS, IDENTITY_DOCUMENT_LABELS } from "@/constants/statuses";

type CustomerFormData = Omit<Customer, "id" | "createdAt" | "updatedAt" | "totalSellCount" | "totalBuyCount" | "totalSellAmount" | "totalBuyAmount">;

type CustomerFormProps = {
  initialData?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  loading?: boolean;
};

export function CustomerForm({ initialData, onSubmit, loading }: CustomerFormProps) {
  const [form, setForm] = useState<CustomerFormData>({
    lastName: initialData?.lastName ?? "",
    firstName: initialData?.firstName ?? "",
    lastNameKana: initialData?.lastNameKana ?? "",
    firstNameKana: initialData?.firstNameKana ?? "",
    phone: initialData?.phone ?? "",
    address: initialData?.address ?? "",
    identityVerified: initialData?.identityVerified ?? false,
    identityDocumentType: initialData?.identityDocumentType ?? "",
    identityVerifiedAt: initialData?.identityVerifiedAt ?? null,
    customerType: initialData?.customerType ?? "both",
    note: initialData?.note ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.lastName) newErrors.lastName = "姓を入力してください";
    if (!form.firstName) newErrors.firstName = "名を入力してください";
    if (!form.phone) newErrors.phone = "電話番号を入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const update = (field: keyof CustomerFormData, value: unknown) => {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="姓"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          error={errors.lastName}
          placeholder="山田"
          required
        />
        <Input
          label="名"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          error={errors.firstName}
          placeholder="太郎"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="姓（カナ）"
          value={form.lastNameKana}
          onChange={(e) => update("lastNameKana", e.target.value)}
          placeholder="ヤマダ"
        />
        <Input
          label="名（カナ）"
          value={form.firstNameKana}
          onChange={(e) => update("firstNameKana", e.target.value)}
          placeholder="タロウ"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="電話番号"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
          placeholder="090-1234-5678"
          required
        />
        <Select
          label="顧客種別"
          value={form.customerType}
          onChange={(e) => update("customerType", e.target.value as CustomerType)}
          options={Object.entries(CUSTOMER_TYPE_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </div>

      <Input
        label="住所"
        value={form.address}
        onChange={(e) => update("address", e.target.value)}
        placeholder="東京都..."
        helpText="古物営業法により、買取時は住所の確認が必要です"
      />

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-medium text-foreground">本人確認</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="本人確認書類"
            value={form.identityDocumentType}
            onChange={(e) => {
              const docType = e.target.value as IdentityDocumentType;
              update("identityDocumentType", docType);
              if (docType) {
                update("identityVerified", true);
                update("identityVerifiedAt", new Date());
              }
            }}
            options={Object.entries(IDENTITY_DOCUMENT_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            placeholder="選択してください"
          />
          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="identityVerified"
                checked={form.identityVerified}
                onChange={(e) => {
                  update("identityVerified", e.target.checked);
                  if (e.target.checked) {
                    update("identityVerifiedAt", new Date());
                  } else {
                    update("identityVerifiedAt", null);
                  }
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="identityVerified" className="text-sm text-foreground">
                本人確認済み
              </label>
            </div>
          </div>
        </div>
      </div>

      <Textarea
        label="備考"
        value={form.note}
        onChange={(e) => update("note", e.target.value)}
        placeholder="メモ..."
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={loading}>
          保存
        </Button>
      </div>
    </form>
  );
}
