"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui";

type QRScannerProps = {
  onScan: (value: string) => void;
};

export function QRScanner({ onScan }: QRScannerProps) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);

  const stopScanner = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
    }
    setActive(false);
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

  const startScanner = useCallback(async () => {
    setError("");
    setLastScanned("");

    if (!("BarcodeDetector" in window)) {
      setError("このブラウザはQRコード読み取りに対応していません。Chrome / Edge をお使いください。");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setActive(true);

      // @ts-expect-error BarcodeDetector is not in all TS libs
      const detector = new BarcodeDetector({ formats: ["qr_code", "code_128", "ean_13", "ean_8"] });

      const scan = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          animRef.current = requestAnimationFrame(scan);
          return;
        }

        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const value = barcodes[0].rawValue;
            if (value && value !== lastScanned) {
              setLastScanned(value);
              onScan(value);
              stopScanner();
              return;
            }
          }
        } catch {
          // detect can fail on some frames, ignore
        }

        animRef.current = requestAnimationFrame(scan);
      };

      animRef.current = requestAnimationFrame(scan);
    } catch {
      setError("カメラにアクセスできません。ブラウザの権限を確認してください。");
    }
  }, [onScan, lastScanned, stopScanner]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">QR / バーコード読み取り</label>
        {!active ? (
          <Button variant="outline" size="sm" onClick={startScanner}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            スキャン開始
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={stopScanner}>
            スキャン停止
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {lastScanned && !active && (
        <div className="flex items-center gap-2 rounded-lg bg-success-light p-3">
          <svg className="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-medium text-success">読み取り完了</p>
            <p className="font-mono text-xs text-foreground">{lastScanned}</p>
          </div>
        </div>
      )}

      {active && (
        <div className="relative overflow-hidden rounded-lg border-2 border-primary bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-lg border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
          </div>
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <p className="text-sm font-medium text-white drop-shadow-md">
              枠内にQRコード / バーコードを合わせてください
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
