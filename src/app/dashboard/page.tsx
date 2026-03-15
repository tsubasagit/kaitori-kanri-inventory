"use client";

import { useMemo } from "react";
import { useItems } from "@/hooks/useItems";
import { useTransactions } from "@/hooks/useTransactions";
import { Spinner } from "@/components/ui";
import { TodaySummary } from "@/components/dashboard/TodaySummary";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { getDateKey } from "@/utils/date";

export default function DashboardPage() {
  const { items, loading: itemsLoading } = useItems();
  const { transactions, loading: txLoading } = useTransactions();

  const summaryData = useMemo(() => {
    const todayKey = getDateKey(new Date());

    const todayTx = transactions.filter(
      (tx) => getDateKey(tx.createdAt) === todayKey
    );

    const todaySalesTx = todayTx.filter((tx) => tx.type === "sale");
    const todayPurchasesTx = todayTx.filter((tx) => tx.type === "purchase");

    return {
      todaySales: todaySalesTx.reduce((sum, tx) => sum + tx.total, 0),
      todaySalesCount: todaySalesTx.length,
      todayPurchases: todayPurchasesTx.reduce((sum, tx) => sum + tx.total, 0),
      todayPurchasesCount: todayPurchasesTx.length,
      totalStock: items.filter((item) => item.status === "in_stock").length,
    };
  }, [items, transactions]);

  if (itemsLoading || txLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TodaySummary data={summaryData} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactions transactions={transactions} />
        <QuickActions />
      </div>
    </div>
  );
}
