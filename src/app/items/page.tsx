"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useItems } from "@/hooks/useItems";
import { Card, Button, Input, Select, Spinner, EmptyState, Table } from "@/components/ui";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { ROUTES } from "@/constants/routes";
import { CATEGORIES, CATEGORY_LABELS } from "@/constants/categories";
import { ITEM_STATUS_LABELS, CONDITION_LABELS } from "@/constants/statuses";
import { Item, ItemStatus } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

export default function ItemsPage() {
  const { items, loading } = useItems();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const filtered = useMemo(() => {
    let result = items;

    if (statusFilter) {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (categoryFilter) {
      result = result.filter((i) => i.category === categoryFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.brand.toLowerCase().includes(q) ||
          i.barcode.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, search, statusFilter, categoryFilter]);

  const columns = [
    {
      key: "name",
      header: "商品名",
      render: (item: Item) => (
        <Link href={ROUTES.itemDetail(item.id)} className="font-medium text-primary hover:underline">
          {item.name}
        </Link>
      ),
    },
    {
      key: "brand",
      header: "ブランド",
      render: (item: Item) => item.brand || "-",
      className: "hidden md:table-cell",
    },
    {
      key: "category",
      header: "カテゴリ",
      render: (item: Item) => CATEGORY_LABELS[item.category] || item.category,
      className: "hidden lg:table-cell",
    },
    {
      key: "condition",
      header: "状態",
      render: (item: Item) => CONDITION_LABELS[item.condition],
      className: "hidden sm:table-cell",
    },
    {
      key: "price",
      header: "販売価格",
      render: (item: Item) => formatCurrency(item.sellingPrice),
    },
    {
      key: "status",
      header: "ステータス",
      render: (item: Item) => <ItemStatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "登録日",
      render: (item: Item) => (
        <span className="text-secondary">{formatDate(item.createdAt)}</span>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            placeholder="商品名・ブランド・バーコードで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "全ステータス" },
              ...Object.entries(ITEM_STATUS_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
            className="max-w-[160px]"
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "", label: "全カテゴリ" },
              ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
            ]}
            className="max-w-[160px]"
          />
        </div>
        <Link href={ROUTES.itemsNew}>
          <Button>在庫登録</Button>
        </Link>
      </div>

      <Card>
        {filtered.length === 0 && !search && !statusFilter && !categoryFilter ? (
          <EmptyState
            title="在庫が登録されていません"
            description="最初の商品を登録しましょう"
            action={
              <Link href={ROUTES.itemsNew}>
                <Button>在庫登録</Button>
              </Link>
            }
          />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(i) => i.id}
            emptyMessage="検索結果がありません"
          />
        )}
      </Card>
    </div>
  );
}
