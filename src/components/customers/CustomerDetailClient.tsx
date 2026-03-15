"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCustomers } from "@/hooks/useCustomers";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, Button, Badge, Spinner } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { Customer, Transaction } from "@/types";
import { CUSTOMER_TYPE_LABELS, IDENTITY_DOCUMENT_LABELS, TRANSACTION_TYPE_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDateTime } from "@/utils/date";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function CustomerDetailClient() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { getCustomer, updateCustomer } = useCustomers();
  const { transactions } = useTransactions();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    getCustomer(id).then((c) => {
      setCustomer(c);
      setLoading(false);
    });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const customerTransactions = transactions.filter((tx) => tx.customerId === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <Card>
        <p className="text-center text-secondary">顧客が見つかりません</p>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => router.push(ROUTES.customers)}>
            一覧に戻る
          </Button>
        </div>
      </Card>
    );
  }

  if (editing) {
    const handleUpdate = async (data: Parameters<typeof updateCustomer>[1]) => {
      setSaving(true);
      try {
        await updateCustomer(id, data);
        const updated = await getCustomer(id);
        setCustomer(updated);
        setEditing(false);
        toast.success("顧客情報を更新しました");
      } catch {
        toast.error("更新に失敗しました");
      } finally {
        setSaving(false);
      }
    };

    return (
      <Card
        title="顧客編集"
        action={
          <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
            キャンセル
          </Button>
        }
      >
        <CustomerForm
          initialData={customer}
          onSubmit={handleUpdate}
          loading={saving}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        title={`${customer.lastName} ${customer.firstName}`}
        action={
          <Button size="sm" onClick={() => setEditing(true)}>
            編集
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-secondary">カナ</p>
            <p className="text-sm">{customer.lastNameKana} {customer.firstNameKana}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">電話番号</p>
            <p className="text-sm">{customer.phone}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">住所</p>
            <p className="text-sm">{customer.address || "未登録"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">顧客種別</p>
            <Badge>{CUSTOMER_TYPE_LABELS[customer.customerType]}</Badge>
          </div>
          <div>
            <p className="text-xs text-secondary">本人確認</p>
            {customer.identityVerified ? (
              <div>
                <Badge color="var(--success)" bgColor="var(--success-light)">確認済み</Badge>
                <p className="mt-1 text-xs text-secondary">
                  {customer.identityDocumentType && IDENTITY_DOCUMENT_LABELS[customer.identityDocumentType]}
                  {customer.identityVerifiedAt && ` (${formatDate(customer.identityVerifiedAt)})`}
                </p>
              </div>
            ) : (
              <Badge color="var(--warning)" bgColor="var(--warning-light)">未確認</Badge>
            )}
          </div>
          <div>
            <p className="text-xs text-secondary">登録日</p>
            <p className="text-sm">{formatDate(customer.createdAt)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-muted p-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-xs text-secondary">買取回数</p>
            <p className="text-lg font-bold text-primary">{customer.totalSellCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondary">買取総額</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(customer.totalSellAmount)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondary">購入回数</p>
            <p className="text-lg font-bold text-success">{customer.totalBuyCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondary">購入総額</p>
            <p className="text-lg font-bold text-success">{formatCurrency(customer.totalBuyAmount)}</p>
          </div>
        </div>

        {customer.note && (
          <div className="mt-4">
            <p className="text-xs text-secondary">備考</p>
            <p className="text-sm whitespace-pre-wrap">{customer.note}</p>
          </div>
        )}
      </Card>

      <Card title="取引履歴">
        {customerTransactions.length === 0 ? (
          <p className="py-4 text-center text-sm text-secondary">取引がありません</p>
        ) : (
          <div className="space-y-2">
            {customerTransactions.map((tx: Transaction) => (
              <Link
                key={tx.id}
                href={ROUTES.transactionDetail(tx.id)}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    color={tx.type === "sale" ? "var(--success)" : "var(--primary)"}
                    bgColor={tx.type === "sale" ? "var(--success-light)" : "var(--primary-light)"}
                  >
                    {TRANSACTION_TYPE_LABELS[tx.type]}
                  </Badge>
                  <span className="text-sm">{tx.receiptNumber}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(tx.total)}</p>
                  <p className="text-xs text-secondary">{formatDateTime(tx.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
