"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { Item, PaymentMethod } from "@/types";
import { PAYMENT_METHOD_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";

type CheckoutSummaryProps = {
  items: Item[];
  onConfirm: (params: {
    paymentMethod: PaymentMethod;
    amountReceived: number;
    change: number;
  }) => void;
  loading: boolean;
};

export function CheckoutSummary({ items, onConfirm, loading }: CheckoutSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountReceived, setAmountReceived] = useState<number>(0);

  const total = items.reduce((sum, item) => sum + item.sellingPrice, 0);
  const change = paymentMethod === "cash" ? Math.max(0, amountReceived - total) : 0;
  const canConfirm = paymentMethod !== "cash" || amountReceived >= total;

  const quickAmounts = [1000, 3000, 5000, 10000];

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-4 text-center">
        <p className="text-sm text-secondary">お会計</p>
        <p className="text-3xl font-bold text-foreground">{formatCurrency(total)}</p>
      </div>

      <Select
        label="決済方法"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        options={Object.entries(PAYMENT_METHOD_LABELS).map(([v, l]) => ({ value: v, label: l }))}
      />

      {paymentMethod === "cash" && (
        <div className="space-y-3">
          <Input
            label="お預り金額"
            type="number"
            value={amountReceived || ""}
            onChange={(e) => setAmountReceived(Number(e.target.value))}
            min={0}
          />
          <div className="flex gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setAmountReceived(amount)}
                className="flex-1 rounded-lg border border-border px-2 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                ¥{amount.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmountReceived(total)}
              className="flex-1 rounded-lg border border-primary bg-primary-light px-2 py-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              ちょうど
            </button>
          </div>
          {amountReceived > 0 && (
            <div className="rounded-lg bg-success-light p-3 text-center">
              <p className="text-sm text-secondary">お釣り</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(change)}</p>
            </div>
          )}
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={() => onConfirm({ paymentMethod, amountReceived, change })}
        loading={loading}
        disabled={!canConfirm}
      >
        会計を確定
      </Button>
    </div>
  );
}
