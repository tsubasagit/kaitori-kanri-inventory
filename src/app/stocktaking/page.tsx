"use client";

import Link from "next/link";
import { useStocktaking } from "@/hooks/useStocktaking";
import { Card, Button, Spinner, EmptyState, Table } from "@/components/ui";
import { StocktakingStatusBadge } from "@/components/stocktaking/StocktakingStatusBadge";
import { ROUTES } from "@/constants/routes";
import { STOCKTAKING_SCOPE_LABELS } from "@/constants/statuses";
import { CATEGORY_LABELS } from "@/constants/categories";
import { StocktakingSession } from "@/types";
import { formatDateTime } from "@/utils/date";

export default function StocktakingPage() {
  const { sessions, loading } = useStocktaking();

  const columns = [
    {
      key: "date",
      header: "開始日時",
      render: (s: StocktakingSession) => (
        <Link href={ROUTES.stocktakingDetail(s.id)} className="font-medium text-primary hover:underline">
          {formatDateTime(s.createdAt)}
        </Link>
      ),
    },
    {
      key: "scope",
      header: "スコープ",
      render: (s: StocktakingSession) => (
        <span>
          {STOCKTAKING_SCOPE_LABELS[s.scope]}
          {s.scope === "category" && s.targetCategory && (
            <span className="ml-1 text-secondary">
              ({CATEGORY_LABELS[s.targetCategory] || s.targetCategory})
            </span>
          )}
        </span>
      ),
    },
    {
      key: "progress",
      header: "スキャン数",
      render: (s: StocktakingSession) => (
        <span className="font-mono">{s.scannedItems.length}</span>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "status",
      header: "ステータス",
      render: (s: StocktakingSession) => <StocktakingStatusBadge status={s.status} />,
    },
    {
      key: "startedBy",
      header: "担当",
      render: (s: StocktakingSession) => s.startedBy,
      className: "hidden md:table-cell",
    },
    {
      key: "note",
      header: "メモ",
      render: (s: StocktakingSession) => (
        <span className="text-secondary">{s.note || "-"}</span>
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
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold text-foreground">棚卸</h1>
        <Link href={ROUTES.stocktakingNew}>
          <Button>新規棚卸</Button>
        </Link>
      </div>

      <Card>
        {sessions.length === 0 ? (
          <EmptyState
            title="棚卸記録がありません"
            description="最初の棚卸を開始しましょう"
            action={
              <Link href={ROUTES.stocktakingNew}>
                <Button>新規棚卸</Button>
              </Link>
            }
          />
        ) : (
          <Table
            columns={columns}
            data={sessions}
            keyExtractor={(s) => s.id}
            emptyMessage="棚卸記録がありません"
          />
        )}
      </Card>
    </div>
  );
}
