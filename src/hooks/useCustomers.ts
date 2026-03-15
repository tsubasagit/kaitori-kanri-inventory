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
import { Customer } from "@/types";
import { toDateSafe } from "@/utils/date";
import { useAuth } from "@/hooks/useAuth";
import { SAMPLE_CUSTOMERS } from "@/lib/sampleData";

function docToCustomer(id: string, data: Record<string, unknown>): Customer {
  return {
    id,
    lastName: (data.lastName as string) ?? "",
    firstName: (data.firstName as string) ?? "",
    lastNameKana: (data.lastNameKana as string) ?? "",
    firstNameKana: (data.firstNameKana as string) ?? "",
    phone: (data.phone as string) ?? "",
    address: (data.address as string) ?? "",
    identityVerified: (data.identityVerified as boolean) ?? false,
    identityDocumentType: (data.identityDocumentType as Customer["identityDocumentType"]) ?? "",
    identityVerifiedAt: data.identityVerifiedAt ? toDateSafe(data.identityVerifiedAt) : null,
    customerType: (data.customerType as Customer["customerType"]) ?? "both",
    totalSellCount: (data.totalSellCount as number) ?? 0,
    totalBuyCount: (data.totalBuyCount as number) ?? 0,
    totalSellAmount: (data.totalSellAmount as number) ?? 0,
    totalBuyAmount: (data.totalBuyAmount as number) ?? 0,
    note: (data.note as string) ?? "",
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
  };
}

export function useCustomers() {
  const { isGuest } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      setCustomers(SAMPLE_CUSTOMERS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((d) =>
        docToCustomer(d.id, d.data() as Record<string, unknown>)
      );
      setCustomers(results);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isGuest]);

  const createCustomer = async (
    data: Omit<Customer, "id" | "createdAt" | "updatedAt" | "totalSellCount" | "totalBuyCount" | "totalSellAmount" | "totalBuyAmount">
  ): Promise<string> => {
    if (isGuest) {
      const id = `c${Date.now()}`;
      const newCustomer: Customer = { ...data, id, totalSellCount: 0, totalBuyCount: 0, totalSellAmount: 0, totalBuyAmount: 0, createdAt: new Date(), updatedAt: new Date() };
      setCustomers((prev) => [newCustomer, ...prev]);
      return id;
    }
    const docRef = await addDoc(collection(db, "customers"), {
      ...data,
      totalSellCount: 0,
      totalBuyCount: 0,
      totalSellAmount: 0,
      totalBuyAmount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateCustomer = async (
    id: string,
    data: Partial<Omit<Customer, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> => {
    if (isGuest) {
      setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...data, updatedAt: new Date() } : c));
      return;
    }
    await updateDoc(doc(db, "customers", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const getCustomer = async (id: string): Promise<Customer | null> => {
    if (isGuest) {
      return customers.find((c) => c.id === id) ?? null;
    }
    const snap = await getDoc(doc(db, "customers", id));
    if (!snap.exists()) return null;
    return docToCustomer(snap.id, snap.data() as Record<string, unknown>);
  };

  return { customers, loading, createCustomer, updateCustomer, getCustomer };
}
