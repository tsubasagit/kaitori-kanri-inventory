"use client";

import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { Transaction } from "@/types";
import { TRANSACTION_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { ROUTES } from "@/constants/routes";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card title="直近の取引">
      {transactions.length === 0 ? (
        <p className="py-4 text-center text-sm text-secondary">取引がありません</p>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => (
            <Link
              key={tx.id}
              href={ROUTES.transactionDetail(tx.id)}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <Badge
                  color={tx.type === "sale" ? "var(--success)" : "var(--primary)"}
                  bgColor={tx.type === "sale" ? "var(--success-light)" : "var(--primary-light)"}
                >
                  {TRANSACTION_TYPE_LABELS[tx.type]}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {tx.receiptNumber}
                  </p>
                  <p className="text-xs text-secondary">
                    {tx.customerName || "一般顧客"} / {PAYMENT_METHOD_LABELS[tx.paymentMethod]}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${tx.type === "sale" ? "text-success" : "text-primary"}`}>
                  {tx.type === "sale" ? "+" : "-"}{formatCurrency(tx.total)}
                </p>
                <p className="text-xs text-secondary">{formatDateTime(tx.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
