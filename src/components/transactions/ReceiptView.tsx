"use client";

import { Transaction } from "@/types";
import { TRANSACTION_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";

export function ReceiptView({ transaction }: { transaction: Transaction }) {
  const tx = transaction;

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-border bg-white p-6 font-mono text-sm">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold">古着在庫管理</h2>
        <p className="text-xs text-secondary">
          {TRANSACTION_TYPE_LABELS[tx.type]}レシート
        </p>
      </div>

      <div className="border-t border-dashed border-border py-2">
        <div className="flex justify-between">
          <span className="text-secondary">レシート番号</span>
          <span>{tx.receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary">日時</span>
          <span>{formatDateTime(tx.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary">担当</span>
          <span>{tx.staffName}</span>
        </div>
        {tx.customerName && (
          <div className="flex justify-between">
            <span className="text-secondary">顧客</span>
            <span>{tx.customerName}</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-border py-2">
        <p className="mb-2 text-xs font-medium text-secondary">商品明細</p>
        {tx.items.map((item, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <div>
              <p>{item.itemName}</p>
              {item.brand && (
                <p className="text-xs text-secondary">{item.brand}</p>
              )}
            </div>
            <span className="whitespace-nowrap">{formatCurrency(item.price)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-border py-2">
        <div className="flex justify-between text-base font-bold">
          <span>合計</span>
          <span>{formatCurrency(tx.total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary">決済方法</span>
          <span>{PAYMENT_METHOD_LABELS[tx.paymentMethod]}</span>
        </div>
        {tx.paymentMethod === "cash" && tx.type === "sale" && (
          <>
            <div className="flex justify-between">
              <span className="text-secondary">お預り</span>
              <span>{formatCurrency(tx.amountReceived)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">お釣り</span>
              <span>{formatCurrency(tx.change)}</span>
            </div>
          </>
        )}
      </div>

      {tx.note && (
        <div className="border-t border-dashed border-border py-2">
          <p className="text-xs text-secondary">備考: {tx.note}</p>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-secondary">
        <p>ありがとうございました</p>
      </div>
    </div>
  );
}
