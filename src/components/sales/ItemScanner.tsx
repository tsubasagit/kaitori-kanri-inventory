"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { BarcodeDetector } from "barcode-detector/pure";
import { Input, Button, Badge } from "@/components/ui";
import { Item } from "@/types";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { CONDITION_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";

type ItemScannerProps = {
  items: Item[];
  onSelect: (item: Item) => void;
  cartItemIds: string[];
};

export function ItemScanner({ items, onSelect, cartItemIds }: ItemScannerProps) {
  const [search, setSearch] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanResult, setScanResult] = useState<{ value: string; matched: boolean; itemName?: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);

  const availableItems = useMemo(() => {
    return items.filter((i) => i.status === "in_stock" && !cartItemIds.includes(i.id));
  }, [items, cartItemIds]);

  const filtered = useMemo(() => {
    if (!search) return availableItems.slice(0, 10);
    const q = search.toLowerCase();
    return availableItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q) ||
        i.barcode.toLowerCase().includes(q)
    );
  }, [availableItems, search]);

  const stopScanner = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
    }
    setScannerActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  const handleScanResult = useCallback((value: string) => {
    const match = availableItems.find(
      (i) => i.barcode === value || i.barcode.toLowerCase() === value.toLowerCase()
    );
    if (match) {
      onSelect(match);
      setScanResult({ value, matched: true, itemName: match.name });
    } else {
      setScanResult({ value, matched: false });
      setSearch(value);
    }
    stopScanner();
  }, [availableItems, onSelect, stopScanner]);

  const startScanner = useCallback(async () => {
    setScanError("");
    setScanResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScannerActive(true);

      const detector = new BarcodeDetector({ formats: ["qr_code", "code_128", "ean_13", "ean_8"] });
      let lastValue = "";

      const scan = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          animRef.current = requestAnimationFrame(scan);
          return;
        }
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const value = barcodes[0].rawValue;
            if (value && value !== lastValue) {
              lastValue = value;
              handleScanResult(value);
              return;
            }
          }
        } catch {
          // ignore detection errors
        }
        animRef.current = requestAnimationFrame(scan);
      };

      animRef.current = requestAnimationFrame(scan);
    } catch {
      setScanError("カメラにアクセスできません。ブラウザの権限を確認してください。");
    }
  }, [handleScanResult]);

  return (
    <div className="space-y-3">
      {/* QRスキャンボタン */}
      <div className="space-y-2">
        {!scannerActive ? (
          <button
            type="button"
            onClick={startScanner}
            className="flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-primary bg-primary-light/50 p-4 text-left transition-colors hover:bg-primary-light"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-primary">QR / バーコードで追加</p>
              <p className="text-sm text-primary/70">商品のバーコードをスキャンしてカートに追加</p>
            </div>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-lg border-2 border-primary bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-40 w-40 rounded-lg border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white drop-shadow-md">
                  枠内にバーコード / QRコードを合わせてください
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={stopScanner}>
              スキャン停止
            </Button>
          </div>
        )}

        {scanError && <p className="text-sm text-danger">{scanError}</p>}

        {scanResult && (
          <div className={`flex items-center gap-2 rounded-lg p-3 ${scanResult.matched ? "bg-success-light" : "bg-warning-light"}`}>
            {scanResult.matched ? (
              <>
                <svg className="h-5 w-5 shrink-0 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-success">カートに追加しました</p>
                  <p className="text-xs text-foreground">{scanResult.itemName}</p>
                </div>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 shrink-0 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.194-.833-2.964 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-warning">該当する在庫が見つかりません</p>
                  <p className="font-mono text-xs text-foreground">{scanResult.value}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* テキスト検索 */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-0 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-xs text-secondary">または手動で検索</span>
          <div className="flex-1 border-t border-border" />
        </div>
        <div className="pt-5">
          <Input
            placeholder="商品名・ブランド・バーコードで検索..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setScanResult(null); }}
          />
        </div>
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-4 text-center text-sm text-secondary">
            {search ? "該当する商品がありません" : "在庫がありません"}
          </p>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item);
                setSearch("");
                setScanResult(null);
              }}
              className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-secondary">
                    {item.brand} / {CONDITION_LABELS[item.condition]} / {item.size}
                  </p>
                  <p className="font-mono text-xs text-secondary">{item.barcode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(item.sellingPrice)}
                  </p>
                  <ItemStatusBadge status={item.status} />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
