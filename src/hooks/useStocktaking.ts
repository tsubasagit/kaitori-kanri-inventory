"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { StocktakingSession, ScannedItem, StocktakingReport } from "@/types";
import { toDateSafe } from "@/utils/date";
import { useAuth } from "@/hooks/useAuth";
import { SAMPLE_STOCKTAKING_SESSIONS } from "@/lib/sampleData";

function docToSession(id: string, data: Record<string, unknown>): StocktakingSession {
  const scannedItems = (data.scannedItems as Record<string, unknown>[] | undefined) ?? [];
  return {
    id,
    status: (data.status as StocktakingSession["status"]) ?? "open",
    scope: (data.scope as StocktakingSession["scope"]) ?? "full",
    targetCategory: (data.targetCategory as string) ?? "",
    startedBy: (data.startedBy as string) ?? "",
    scannedItems: scannedItems.map((si) => ({
      itemId: (si.itemId as string) ?? "",
      barcode: (si.barcode as string) ?? "",
      itemName: (si.itemName as string) ?? "",
      brand: (si.brand as string) ?? "",
      scannedAt: toDateSafe(si.scannedAt),
      scannedBy: (si.scannedBy as string) ?? "",
    })),
    report: (data.report as StocktakingReport | null) ?? null,
    note: (data.note as string) ?? "",
    createdAt: toDateSafe(data.createdAt),
    closedAt: data.closedAt ? toDateSafe(data.closedAt) : null,
  };
}

export function useStocktaking() {
  const { isGuest } = useAuth();
  const [sessions, setSessions] = useState<StocktakingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      setSessions(SAMPLE_STOCKTAKING_SESSIONS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "stocktaking_sessions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((d) =>
        docToSession(d.id, d.data() as Record<string, unknown>)
      );
      setSessions(results);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isGuest]);

  const createSession = async (
    data: Pick<StocktakingSession, "scope" | "targetCategory" | "startedBy" | "note">
  ): Promise<string> => {
    if (isGuest) {
      const id = `st${Date.now()}`;
      const newSession: StocktakingSession = {
        ...data,
        id,
        status: "open",
        scannedItems: [],
        report: null,
        createdAt: new Date(),
        closedAt: null,
      };
      setSessions((prev) => [newSession, ...prev]);
      return id;
    }
    const docRef = await addDoc(collection(db, "stocktaking_sessions"), {
      ...data,
      status: "open",
      scannedItems: [],
      report: null,
      createdAt: serverTimestamp(),
      closedAt: null,
    });
    return docRef.id;
  };

  const addScannedItem = async (sessionId: string, item: ScannedItem): Promise<void> => {
    if (isGuest) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, scannedItems: [...s.scannedItems, item] }
            : s
        )
      );
      return;
    }
    const sessionDoc = await getDoc(doc(db, "stocktaking_sessions", sessionId));
    if (!sessionDoc.exists()) return;
    const current = sessionDoc.data();
    const scannedItems = (current.scannedItems as Record<string, unknown>[]) ?? [];
    await updateDoc(doc(db, "stocktaking_sessions", sessionId), {
      scannedItems: [...scannedItems, { ...item, scannedAt: new Date() }],
    });
  };

  const closeSession = async (
    sessionId: string,
    report: StocktakingReport
  ): Promise<void> => {
    if (isGuest) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, status: "closed", report, closedAt: new Date() }
            : s
        )
      );
      return;
    }
    await updateDoc(doc(db, "stocktaking_sessions", sessionId), {
      status: "closed",
      report,
      closedAt: serverTimestamp(),
    });
  };

  const getSession = async (id: string): Promise<StocktakingSession | null> => {
    if (isGuest) {
      return sessions.find((s) => s.id === id) ?? null;
    }
    const snap = await getDoc(doc(db, "stocktaking_sessions", id));
    if (!snap.exists()) return null;
    return docToSession(snap.id, snap.data() as Record<string, unknown>);
  };

  return { sessions, loading, createSession, addScannedItem, closeSession, getSession };
}
