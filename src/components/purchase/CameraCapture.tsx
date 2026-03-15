"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui";

type CameraCaptureProps = {
  photos: string[];
  onCapture: (dataUrl: string) => void;
  onRemove: (index: number) => void;
};

export function CameraCapture({ photos, onCapture, onRemove }: CameraCaptureProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setError("カメラにアクセスできません。ブラウザの権限を確認してください。");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(dataUrl);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">商品写真</label>
        {!cameraActive ? (
          <Button variant="outline" size="sm" onClick={startCamera}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            カメラを起動
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={stopCamera}>
            カメラを閉じる
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {cameraActive && (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-lg border border-border bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={takePhoto}
              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary bg-white transition-transform hover:scale-105 active:scale-95"
              aria-label="撮影"
            >
              <div className="h-10 w-10 rounded-full bg-primary" />
            </button>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {photos.map((photo, idx) => (
            <div key={idx} className="relative shrink-0">
              <img
                src={photo}
                alt={`商品写真 ${idx + 1}`}
                className="h-20 w-20 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
