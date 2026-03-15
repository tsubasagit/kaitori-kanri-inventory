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
import { Item } from "@/types";
import { toDateSafe } from "@/utils/date";
import { generateBarcode } from "@/utils/barcode";
import { useAuth } from "@/hooks/useAuth";
import { SAMPLE_ITEMS } from "@/lib/sampleData";

function docToItem(id: string, data: Record<string, unknown>): Item {
  return {
    id,
    name: (data.name as string) ?? "",
    brand: (data.brand as string) ?? "",
    category: (data.category as string) ?? "",
    subcategory: (data.subcategory as string) ?? "",
    size: (data.size as string) ?? "",
    color: (data.color as string) ?? "",
    condition: (data.condition as Item["condition"]) ?? "B",
    purchasePrice: (data.purchasePrice as number) ?? 0,
    sellingPrice: (data.sellingPrice as number) ?? 0,
    customerId: (data.customerId as string) ?? "",
    purchaseTransactionId: (data.purchaseTransactionId as string) ?? "",
    photoUrls: (data.photoUrls as string[]) ?? [],
    barcode: (data.barcode as string) ?? "",
    status: (data.status as Item["status"]) ?? "in_stock",
    registeredBy: (data.registeredBy as string) ?? "",
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
  };
}

export function useItems() {
  const { isGuest } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      setItems(SAMPLE_ITEMS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((d) =>
        docToItem(d.id, d.data() as Record<string, unknown>)
      );
      setItems(results);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isGuest]);

  const createItem = async (
    data: Omit<Item, "id" | "barcode" | "createdAt" | "updatedAt">
  ): Promise<string> => {
    if (isGuest) {
      const id = `i${Date.now()}`;
      const newItem: Item = { ...data, id, barcode: generateBarcode(), createdAt: new Date(), updatedAt: new Date() };
      setItems((prev) => [newItem, ...prev]);
      return id;
    }
    const docRef = await addDoc(collection(db, "items"), {
      ...data,
      barcode: generateBarcode(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateItem = async (
    id: string,
    data: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> => {
    if (isGuest) {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...data, updatedAt: new Date() } : i));
      return;
    }
    await updateDoc(doc(db, "items", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const getItem = async (id: string): Promise<Item | null> => {
    if (isGuest) {
      return items.find((i) => i.id === id) ?? null;
    }
    const snap = await getDoc(doc(db, "items", id));
    if (!snap.exists()) return null;
    return docToItem(snap.id, snap.data() as Record<string, unknown>);
  };

  return { items, loading, createItem, updateItem, getItem };
}
