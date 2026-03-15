"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, Input, Select, Badge, Spinner, EmptyState, Table } from "@/components/ui";
import { Transaction, TransactionType } from "@/types";
import { TRANSACTION_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { ROUTES } from "@/constants/routes";

export default function TransactionsPage() {
  const { transactions, loading } = useTransactions();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const filtered = useMemo(() => {
    let result = transactions;

    if (typeFilter) {
      result = result.filter((tx) => tx.type === typeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.receiptNumber.toLowerCase().includes(q) ||
          tx.customerName.toLowerCase().includes(q) ||
          tx.staffName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [transactions, search, typeFilter]);

  const columns = [
    {
      key: "type",
      header: "種別",
      render: (tx: Transaction) => (
        <Badge
          color={tx.type === "sale" ? "var(--success)" : "var(--primary)"}
          bgColor={tx.type === "sale" ? "var(--success-light)" : "var(--primary-light)"}
        >
          {TRANSACTION_TYPE_LABELS[tx.type]}
        </Badge>
      ),
    },
    {
      key: "receipt",
      header: "レシート番号",
      render: (tx: Transaction) => (
        <Link href={ROUTES.transactionDetail(tx.id)} className="font-medium text-primary hover:underline">
          {tx.receiptNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "顧客",
      render: (tx: Transaction) => tx.customerName || "一般顧客",
      className: "hidden md:table-cell",
    },
    {
      key: "items",
      header: "点数",
      render: (tx: Transaction) => `${tx.items.length}点`,
      className: "hidden sm:table-cell",
    },
    {
      key: "total",
      header: "金額",
      render: (tx: Transaction) => (
        <span className={tx.type === "sale" ? "text-success font-medium" : "text-primary font-medium"}>
          {formatCurrency(tx.total)}
        </span>
      ),
    },
    {
      key: "payment",
      header: "決済",
      render: (tx: Transaction) => PAYMENT_METHOD_LABELS[tx.paymentMethod],
      className: "hidden lg:table-cell",
    },
    {
      key: "staff",
      header: "担当",
      render: (tx: Transaction) => tx.staffName,
      className: "hidden lg:table-cell",
    },
    {
      key: "date",
      header: "日時",
      render: (tx: Transaction) => (
        <span className="text-secondary">{formatDateTime(tx.createdAt)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          placeholder="レシート番号・顧客名・担当者で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: "", label: "全種別" },
            ...Object.entries(TRANSACTION_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })),
          ]}
          className="max-w-[140px]"
        />
      </div>

      <Card>
        {filtered.length === 0 && !search && !typeFilter ? (
          <EmptyState
            title="取引がありません"
            description="買取または販売を行うと取引が記録されます"
          />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(tx) => tx.id}
            emptyMessage="検索結果がありません"
          />
        )}
      </Card>
    </div>
  );
}
