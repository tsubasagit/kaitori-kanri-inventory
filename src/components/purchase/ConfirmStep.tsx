"use client";

import { Button, Select } from "@/components/ui";
import { Customer, PaymentMethod } from "@/types";
import { AppraisalItem } from "./AppraisalStep";
import { CONDITION_LABELS, PAYMENT_METHOD_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";

type ConfirmStepProps = {
  customer: Customer;
  items: AppraisalItem[];
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
};

export function ConfirmStep({
  customer,
  items,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  onBack,
  loading,
}: ConfirmStepProps) {
  const total = items.reduce((sum, item) => sum + item.purchasePrice, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-medium text-foreground">顧客情報</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs text-secondary">氏名</p>
            <p className="text-sm font-medium">{customer.lastName} {customer.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">電話番号</p>
            <p className="text-sm">{customer.phone}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">住所</p>
            <p className="text-sm">{customer.address || "未登録"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">本人確認</p>
            <p className={`text-sm font-medium ${customer.identityVerified ? "text-success" : "text-danger"}`}>
              {customer.identityVerified ? "確認済み" : "未確認"}
            </p>
          </div>
        </div>
        {!customer.identityVerified && (
          <div className="mt-3 rounded-lg bg-warning-light p-3">
            <p className="text-sm text-warning">
              古物営業法により、買取時は本人確認が必要です。顧客詳細画面で本人確認を完了してください。
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-medium text-foreground">
          買取商品（{items.length}点）
        </h3>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-border py-2 last:border-b-0">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-secondary">
                  {item.brand} / {CONDITION_LABELS[item.condition]}
                </p>
                {item.barcode && (
                  <p className="font-mono text-xs text-primary">{item.barcode}</p>
                )}
              </div>
              <p className="text-sm font-medium">{formatCurrency(item.purchasePrice)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <p className="font-medium">買取合計</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(total)}</p>
        </div>
      </div>

      <Select
        label="支払方法"
        value={paymentMethod}
        onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
        options={Object.entries(PAYMENT_METHOD_LABELS).map(([v, l]) => ({ value: v, label: l }))}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          戻る
        </Button>
        <Button onClick={onConfirm} loading={loading}>
          買取を確定
        </Button>
      </div>
    </div>
  );
}
