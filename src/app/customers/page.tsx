"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCustomers } from "@/hooks/useCustomers";
import { Card, Button, Input, Badge, Spinner, EmptyState, Table } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { CUSTOMER_TYPE_LABELS } from "@/constants/statuses";
import { Customer } from "@/types";
import { formatDate } from "@/utils/date";

export default function CustomersPage() {
  const { customers, loading } = useCustomers();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        `${c.lastName}${c.firstName}`.includes(q) ||
        `${c.lastNameKana}${c.firstNameKana}`.includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, search]);

  const columns = [
    {
      key: "name",
      header: "氏名",
      render: (c: Customer) => (
        <Link href={ROUTES.customerDetail(c.id)} className="font-medium text-primary hover:underline">
          {c.lastName} {c.firstName}
        </Link>
      ),
    },
    {
      key: "kana",
      header: "カナ",
      render: (c: Customer) => (
        <span className="text-secondary">{c.lastNameKana} {c.firstNameKana}</span>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "phone",
      header: "電話番号",
      render: (c: Customer) => c.phone,
    },
    {
      key: "type",
      header: "種別",
      render: (c: Customer) => (
        <Badge>{CUSTOMER_TYPE_LABELS[c.customerType]}</Badge>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "verified",
      header: "本人確認",
      render: (c: Customer) =>
        c.identityVerified ? (
          <Badge color="var(--success)" bgColor="var(--success-light)">確認済み</Badge>
        ) : (
          <Badge color="var(--warning)" bgColor="var(--warning-light)">未確認</Badge>
        ),
    },
    {
      key: "createdAt",
      header: "登録日",
      render: (c: Customer) => (
        <span className="text-secondary">{formatDate(c.createdAt)}</span>
      ),
      className: "hidden lg:table-cell",
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="氏名・カナ・電話番号で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Link href={ROUTES.customersNew}>
          <Button>顧客登録</Button>
        </Link>
      </div>

      <Card>
        {filtered.length === 0 && !search ? (
          <EmptyState
            title="顧客が登録されていません"
            description="最初の顧客を登録しましょう"
            action={
              <Link href={ROUTES.customersNew}>
                <Button>顧客登録</Button>
              </Link>
            }
          />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(c) => c.id}
            emptyMessage="検索結果がありません"
          />
        )}
      </Card>
    </div>
  );
}
