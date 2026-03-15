"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, Button, Spinner } from "@/components/ui";
import { ReceiptView } from "@/components/transactions/ReceiptView";
import { Transaction } from "@/types";
import { ROUTES } from "@/constants/routes";

export default function TransactionDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { getTransaction } = useTransactions();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    getTransaction(id).then((tx) => {
      setTransaction(tx);
      setLoading(false);
    });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <Card>
        <p className="text-center text-secondary">取引が見つかりません</p>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => router.push(ROUTES.transactions)}>
            一覧に戻る
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push(ROUTES.transactions)}>
          一覧に戻る
        </Button>
      </div>
      <ReceiptView transaction={transaction} />
    </div>
  );
}
