"use client";

import { useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui";
import { generateBarcode } from "@/utils/barcode";

type BarcodeGeneratorProps = {
  barcode: string;
  onGenerate: (barcode: string) => void;
};

export function BarcodeGenerator({ barcode, onGenerate }: BarcodeGeneratorProps) {
  const handleGenerate = useCallback(() => {
    onGenerate(generateBarcode());
  }, [onGenerate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">商品番号 / QRコード</label>
        <Button variant="outline" size="sm" onClick={handleGenerate}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          {barcode ? "再発行" : "番号を発行"}
        </Button>
      </div>

      {barcode ? (
        <div className="flex flex-col items-center gap-3 rounded-lg bg-muted p-4">
          <QRCodeSVG value={barcode} size={120} />
          <div className="text-center">
            <p className="font-mono text-sm font-bold text-foreground">{barcode}</p>
            <p className="text-xs text-secondary">この番号が商品に割り当てられます</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
          <p className="text-sm text-secondary">「番号を発行」を押して商品番号を生成してください</p>
        </div>
      )}
    </div>
  );
}
