"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Select, Textarea } from "@/components/ui";
import { useStocktaking } from "@/hooks/useStocktaking";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { CATEGORIES } from "@/constants/categories";
import { StocktakingScope } from "@/types";

export default function StocktakingNewPage() {
  const router = useRouter();
  const { createSession } = useStocktaking();
  const { profile } = useAuth();
  const [scope, setScope] = useState<StocktakingScope>("full");
  const [targetCategory, setTargetCategory] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const id = await createSession({
        scope,
        targetCategory: scope === "category" ? targetCategory : "",
        startedBy: profile?.displayName ?? "スタッフ",
        note,
      });
      router.push(ROUTES.stocktakingDetail(id));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-foreground">新規棚卸</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              棚卸スコープ
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setScope("full")}
                className={`flex-1 rounded-lg border-2 p-4 text-center transition-colors ${
                  scope === "full"
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border text-secondary hover:border-primary/30"
                }`}
              >
                <div className="mb-1 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-8 w-8">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 14l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-sm font-bold">全品棚卸</p>
                <p className="mt-0.5 text-xs text-secondary">全在庫を突合</p>
              </button>
              <button
                type="button"
                onClick={() => setScope("category")}
                className={`flex-1 rounded-lg border-2 p-4 text-center transition-colors ${
                  scope === "category"
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border text-secondary hover:border-primary/30"
                }`}
              >
                <div className="mb-1 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-8 w-8">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <p className="text-sm font-bold">カテゴリ別</p>
                <p className="mt-0.5 text-xs text-secondary">指定カテゴリのみ</p>
              </button>
            </div>
          </div>

          {scope === "category" && (
            <Select
              label="対象カテゴリ"
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              options={[
                { value: "", label: "カテゴリを選択..." },
                ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
              ]}
              required
            />
          )}

          <Textarea
            label="メモ（任意）"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="棚卸の目的や備考があれば入力..."
            rows={3}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push(ROUTES.stocktaking)}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting || (scope === "category" && !targetCategory)}
            >
              {submitting ? "作成中..." : "棚卸を開始"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
