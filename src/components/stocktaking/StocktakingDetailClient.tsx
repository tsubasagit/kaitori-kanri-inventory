"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Input, Spinner, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { StocktakingStatusBadge } from "@/components/stocktaking/StocktakingStatusBadge";
import { useStocktaking } from "@/hooks/useStocktaking";
import { useItems } from "@/hooks/useItems";
import { useAuth } from "@/hooks/useAuth";
import { StocktakingSession, StocktakingReport, Item } from "@/types";
import { STOCKTAKING_SCOPE_LABELS } from "@/constants/statuses";
import { CATEGORY_LABELS } from "@/constants/categories";
import { formatDateTime } from "@/utils/date";
import { formatCurrency } from "@/utils/currency";
import { ROUTES } from "@/constants/routes";

export function StocktakingDetailClient() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { getSession, addScannedItem, closeSession, sessions } = useStocktaking();
  const { items } = useItems();
  const { profile } = useAuth();

  const [session, setSession] = useState<StocktakingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [closing, setClosing] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const found = sessions.find((s) => s.id === id);
    if (found) {
      setSession(found);
      setLoading(false);
    } else {
      getSession(id).then((s) => {
        setSession(s);
        setLoading(false);
      });
    }
  }, [id, sessions, getSession]);

  const targetItems = useMemo(() => {
    if (!session) return [];
    return items.filter((i) => {
      if (i.status !== "in_stock") return false;
      if (session.scope === "category" && session.targetCategory) {
        return i.category === session.targetCategory;
      }
      return true;
    });
  }, [items, session]);

  const scannedBarcodes = useMemo(() => {
    if (!session) return new Set<string>();
    return new Set(session.scannedItems.map((si) => si.barcode));
  }, [session]);

  const handleScan = useCallback(
    async (barcode: string) => {
      if (!session || session.status !== "open") return;
      const trimmed = barcode.trim();
      if (!trimmed) return;

      if (scannedBarcodes.has(trimmed)) {
        toast.warning("このバーコードはスキャン済みです");
        setBarcodeInput("");
        return;
      }

      const item = items.find(
        (i) => i.barcode === trimmed || i.barcode.toLowerCase() === trimmed.toLowerCase()
      );

      await addScannedItem(session.id, {
        itemId: item?.id ?? "",
        barcode: trimmed,
        itemName: item?.name ?? "不明な商品",
        brand: item?.brand ?? "",
        scannedAt: new Date(),
        scannedBy: profile?.displayName ?? "スタッフ",
      });

      if (item) {
        toast.success(`${item.name} をスキャンしました`);
      } else {
        toast.warning(`不明なバーコード: ${trimmed}`);
      }

      setBarcodeInput("");
    },
    [session, scannedBarcodes, items, addScannedItem, profile, toast]
  );

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleScan(barcodeInput);
    }
  };

  const generateReport = useCallback((): StocktakingReport => {
    if (!session) {
      return { systemCount: 0, scannedCount: 0, matchedCount: 0, missingItems: [], unknownBarcodes: [] };
    }

    const targetBarcodeSet = new Set(targetItems.map((i) => i.barcode));
    const scannedSet = new Set(session.scannedItems.map((si) => si.barcode));

    const matchedCount = session.scannedItems.filter((si) => targetBarcodeSet.has(si.barcode)).length;

    const missingItems = targetItems
      .filter((i) => !scannedSet.has(i.barcode))
      .map((i) => ({
        itemId: i.id,
        barcode: i.barcode,
        name: i.name,
        brand: i.brand,
        sellingPrice: i.sellingPrice,
      }));

    const unknownBarcodes = session.scannedItems
      .filter((si) => !targetBarcodeSet.has(si.barcode))
      .map((si) => si.barcode);

    return {
      systemCount: targetItems.length,
      scannedCount: session.scannedItems.length,
      matchedCount,
      missingItems,
      unknownBarcodes,
    };
  }, [session, targetItems]);

  const handleClose = async () => {
    if (!session || closing) return;
    setClosing(true);
    try {
      const report = generateReport();
      await closeSession(session.id, report);
      toast.success("棚卸を完了しました");
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="py-12 text-center">
        <p className="text-secondary">棚卸セッションが見つかりません</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push(ROUTES.stocktaking)}>
          一覧に戻る
        </Button>
      </div>
    );
  }

  const report = session.report ?? (session.status === "open" ? generateReport() : null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(ROUTES.stocktaking)}
            className="text-secondary hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              棚卸 — {formatDateTime(session.createdAt)}
            </h1>
            <p className="text-sm text-secondary">
              {STOCKTAKING_SCOPE_LABELS[session.scope]}
              {session.scope === "category" && session.targetCategory && (
                <span> / {CATEGORY_LABELS[session.targetCategory] || session.targetCategory}</span>
              )}
              {" / "}{session.startedBy}
              {session.note && <span> / {session.note}</span>}
            </p>
          </div>
        </div>
        <StocktakingStatusBadge status={session.status} />
      </div>

      {/* Scanner (open sessions only) */}
      {session.status === "open" && (
        <Card>
          <div className="p-5 space-y-4">
            <h2 className="text-base font-bold text-foreground">商品スキャン</h2>
            <div className="flex gap-2">
              <Input
                placeholder="バーコードを入力またはスキャン..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeKeyDown}
                className="flex-1 font-mono"
                autoFocus
              />
              <Button onClick={() => handleScan(barcodeInput)} disabled={!barcodeInput.trim()}>
                登録
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-secondary">
              <span>
                スキャン済み: <span className="font-bold text-primary">{session.scannedItems.length}</span>
              </span>
              <span>
                対象在庫: <span className="font-bold text-foreground">{targetItems.length}</span>
              </span>
              <span>
                残り: <span className="font-bold text-warning">{Math.max(0, targetItems.length - session.scannedItems.length)}</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${targetItems.length > 0 ? Math.min(100, (session.scannedItems.length / targetItems.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Live Report */}
      {report && (
        <Card>
          <div className="p-5 space-y-4">
            <h2 className="text-base font-bold text-foreground">
              {session.status === "closed" ? "棚卸レポート" : "リアルタイム集計"}
            </h2>

            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{report.systemCount}</p>
                <p className="text-xs text-secondary">システム在庫</p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-2xl font-bold text-primary">{report.scannedCount}</p>
                <p className="text-xs text-secondary">スキャン数</p>
              </div>
              <div className="rounded-lg bg-success-light p-3 text-center">
                <p className="text-2xl font-bold text-success">{report.matchedCount}</p>
                <p className="text-xs text-secondary">一致</p>
              </div>
              <div className="rounded-lg bg-danger-light p-3 text-center">
                <p className="text-2xl font-bold text-danger">{report.missingItems.length}</p>
                <p className="text-xs text-secondary">不明（未スキャン）</p>
              </div>
            </div>

            {/* Missing items */}
            {report.missingItems.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-danger">
                  未スキャン商品（{report.missingItems.length}点）
                </h3>
                <div className="max-h-64 space-y-1.5 overflow-y-auto">
                  {report.missingItems.map((mi) => (
                    <div
                      key={mi.itemId}
                      className="flex items-center justify-between rounded-lg border border-danger/20 bg-danger-light/50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{mi.name}</p>
                        <p className="font-mono text-xs text-secondary">{mi.barcode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary">{mi.brand}</p>
                        <p className="text-xs text-secondary">{formatCurrency(mi.sellingPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unknown barcodes */}
            {report.unknownBarcodes.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-warning">
                  不明バーコード（{report.unknownBarcodes.length}件）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.unknownBarcodes.map((bc) => (
                    <Badge key={bc} color="var(--warning)" bgColor="var(--warning-light)">
                      {bc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Perfect match */}
            {report.missingItems.length === 0 && report.unknownBarcodes.length === 0 && report.scannedCount > 0 && (
              <div className="flex items-center gap-3 rounded-lg bg-success-light p-4">
                <svg className="h-6 w-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-bold text-success">完全一致</p>
                  <p className="text-sm text-success/80">システム在庫とスキャン結果が完全に一致しています</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Scanned items list */}
      <Card>
        <div className="p-5 space-y-3">
          <h2 className="text-base font-bold text-foreground">
            スキャン済み商品（{session.scannedItems.length}点）
          </h2>
          {session.scannedItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-secondary">
              まだスキャンされた商品がありません
            </p>
          ) : (
            <div className="max-h-80 space-y-1.5 overflow-y-auto">
              {[...session.scannedItems].reverse().map((si, idx) => {
                const isKnown = items.some((i) => i.barcode === si.barcode);
                return (
                  <div
                    key={`${si.barcode}-${idx}`}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${isKnown ? "bg-success" : "bg-warning"}`}>
                        {session.scannedItems.length - idx}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{si.itemName}</p>
                        <p className="font-mono text-xs text-secondary">{si.barcode}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-secondary">
                      <p>{si.brand || "-"}</p>
                      <p>{formatDateTime(si.scannedAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Close session button */}
      {session.status === "open" && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push(ROUTES.stocktaking)}>
            後で続ける
          </Button>
          <Button
            onClick={handleClose}
            disabled={closing || session.scannedItems.length === 0}
            className="bg-success text-white hover:bg-success/90"
          >
            {closing ? "完了処理中..." : "棚卸を完了する"}
          </Button>
        </div>
      )}
    </div>
  );
}
