"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  writeBatch,
  increment,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Transaction, TransactionType, TransactionItem, PaymentMethod } from "@/types";
import { toDateSafe, getDateKey } from "@/utils/date";
import { generateReceiptNumber } from "@/utils/receipt";
import { useAuth } from "@/hooks/useAuth";
import { SAMPLE_TRANSACTIONS } from "@/lib/sampleData";

function docToTransaction(id: string, data: Record<string, unknown>): Transaction {
  return {
    id,
    type: (data.type as TransactionType) ?? "sale",
    customerId: (data.customerId as string) ?? "",
    customerName: (data.customerName as string) ?? "",
    items: (data.items as TransactionItem[]) ?? [],
    subtotal: (data.subtotal as number) ?? 0,
    total: (data.total as number) ?? 0,
    paymentMethod: (data.paymentMethod as PaymentMethod) ?? "cash",
    amountReceived: (data.amountReceived as number) ?? 0,
    change: (data.change as number) ?? 0,
    staffId: (data.staffId as string) ?? "",
    staffName: (data.staffName as string) ?? "",
    receiptNumber: (data.receiptNumber as string) ?? "",
    note: (data.note as string) ?? "",
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
  };
}

export function useTransactions() {
  const { isGuest } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      setTransactions(SAMPLE_TRANSACTIONS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((d) =>
        docToTransaction(d.id, d.data() as Record<string, unknown>)
      );
      setTransactions(results);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isGuest]);

  const getNextReceiptNumber = async (type: TransactionType): Promise<string> => {
    const now = new Date();
    if (isGuest) {
      const todayTx = transactions.filter((tx) => tx.type === type && getDateKey(tx.createdAt) === getDateKey(now));
      return generateReceiptNumber(type, now, todayTx.length + 1);
    }
    const dateKey = getDateKey(now);
    const counterRef = doc(db, "counters", "receipts", dateKey, type);
    const snap = await getDoc(counterRef);
    const currentCount = snap.exists() ? (snap.data().count as number) : 0;
    return generateReceiptNumber(type, now, currentCount + 1);
  };

  const createSaleTransaction = async (params: {
    customerId: string;
    customerName: string;
    items: TransactionItem[];
    total: number;
    paymentMethod: PaymentMethod;
    amountReceived: number;
    change: number;
    staffId: string;
    staffName: string;
    note: string;
  }): Promise<string> => {
    if (isGuest) {
      const id = `t${Date.now()}`;
      const receiptNumber = await getNextReceiptNumber("sale");
      const newTx: Transaction = {
        id,
        type: "sale",
        ...params,
        subtotal: params.total,
        receiptNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTransactions((prev) => [newTx, ...prev]);
      return id;
    }

    const now = new Date();
    const dateKey = getDateKey(now);
    const receiptNumber = await getNextReceiptNumber("sale");

    const batch = writeBatch(db);

    const txRef = doc(collection(db, "transactions"));
    batch.set(txRef, {
      type: "sale",
      ...params,
      subtotal: params.total,
      receiptNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    for (const item of params.items) {
      const itemRef = doc(db, "items", item.itemId);
      batch.update(itemRef, {
        status: "sold",
        updatedAt: serverTimestamp(),
      });
    }

    if (params.customerId) {
      const customerRef = doc(db, "customers", params.customerId);
      batch.update(customerRef, {
        totalBuyCount: increment(1),
        totalBuyAmount: increment(params.total),
        updatedAt: serverTimestamp(),
      });
    }

    const counterRef = doc(db, "counters", "receipts", dateKey, "sale");
    await setDoc(counterRef, { count: increment(1) }, { merge: true });

    await batch.commit();
    return txRef.id;
  };

  const createPurchaseTransaction = async (params: {
    customerId: string;
    customerName: string;
    items: TransactionItem[];
    total: number;
    paymentMethod: PaymentMethod;
    staffId: string;
    staffName: string;
    note: string;
    itemsData: Array<{
      name: string;
      brand: string;
      category: string;
      subcategory: string;
      size: string;
      color: string;
      condition: string;
      purchasePrice: number;
      sellingPrice: number;
    }>;
  }): Promise<string> => {
    if (isGuest) {
      const id = `t${Date.now()}`;
      const receiptNumber = await getNextReceiptNumber("purchase");
      const txItems: TransactionItem[] = params.itemsData.map((d, idx) => ({
        itemId: `i${Date.now()}-${idx}`,
        itemName: d.name,
        brand: d.brand,
        price: d.purchasePrice,
      }));
      const newTx: Transaction = {
        id,
        type: "purchase",
        customerId: params.customerId,
        customerName: params.customerName,
        items: txItems,
        subtotal: params.total,
        total: params.total,
        paymentMethod: params.paymentMethod,
        amountReceived: 0,
        change: 0,
        staffId: params.staffId,
        staffName: params.staffName,
        receiptNumber,
        note: params.note,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTransactions((prev) => [newTx, ...prev]);
      return id;
    }

    const now = new Date();
    const dateKey = getDateKey(now);
    const receiptNumber = await getNextReceiptNumber("purchase");

    const batch = writeBatch(db);

    const txRef = doc(collection(db, "transactions"));

    const txItems: TransactionItem[] = [];

    for (const itemData of params.itemsData) {
      const itemRef = doc(collection(db, "items"));

      batch.set(itemRef, {
        ...itemData,
        customerId: params.customerId,
        purchaseTransactionId: txRef.id,
        photoUrls: [],
        barcode: `HKM-${dateKey.replace(/-/g, "")}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
        status: "in_stock",
        registeredBy: params.staffId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      txItems.push({
        itemId: itemRef.id,
        itemName: itemData.name,
        brand: itemData.brand,
        price: itemData.purchasePrice,
      });
    }

    batch.set(txRef, {
      type: "purchase",
      customerId: params.customerId,
      customerName: params.customerName,
      items: txItems,
      subtotal: params.total,
      total: params.total,
      paymentMethod: params.paymentMethod,
      amountReceived: 0,
      change: 0,
      staffId: params.staffId,
      staffName: params.staffName,
      receiptNumber,
      note: params.note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (params.customerId) {
      const customerRef = doc(db, "customers", params.customerId);
      batch.update(customerRef, {
        totalSellCount: increment(1),
        totalSellAmount: increment(params.total),
        updatedAt: serverTimestamp(),
      });
    }

    const counterRef = doc(db, "counters", "receipts", dateKey, "purchase");
    await setDoc(counterRef, { count: increment(1) }, { merge: true });

    await batch.commit();
    return txRef.id;
  };

  const getTransaction = async (id: string): Promise<Transaction | null> => {
    if (isGuest) {
      return transactions.find((tx) => tx.id === id) ?? null;
    }
    const snap = await getDoc(doc(db, "transactions", id));
    if (!snap.exists()) return null;
    return docToTransaction(snap.id, snap.data() as Record<string, unknown>);
  };

  return {
    transactions,
    loading,
    createSaleTransaction,
    createPurchaseTransaction,
    getTransaction,
  };
}
