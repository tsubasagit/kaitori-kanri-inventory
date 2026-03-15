"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomers } from "@/hooks/useCustomers";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { Card, Button, Spinner } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { CustomerStep } from "@/components/purchase/CustomerStep";
import { AppraisalStep, type AppraisalItem } from "@/components/purchase/AppraisalStep";
import { ConfirmStep } from "@/components/purchase/ConfirmStep";
import { Customer, PaymentMethod } from "@/types";
import { ROUTES } from "@/constants/routes";

type Step = "customer" | "appraisal" | "confirm" | "complete";

export default function PurchasePage() {
  const { customers, loading: customersLoading } = useCustomers();
  const { createPurchaseTransaction } = useTransactions();
  const { user, profile } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState<Step>("customer");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<AppraisalItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [submitting, setSubmitting] = useState(false);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setStep("appraisal");
  };

  const handleAddItem = (item: AppraisalItem) => {
    setItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    if (!selectedCustomer || items.length === 0) return;

    setSubmitting(true);
    try {
      const total = items.reduce((sum, item) => sum + item.purchasePrice, 0);
      await createPurchaseTransaction({
        customerId: selectedCustomer.id,
        customerName: `${selectedCustomer.lastName} ${selectedCustomer.firstName}`,
        items: items.map((item) => ({
          itemId: "",
          itemName: item.name,
          brand: item.brand,
          price: item.purchasePrice,
        })),
        total,
        paymentMethod,
        staffId: user?.uid ?? "",
        staffName: profile?.displayName ?? "スタッフ",
        note: "",
        itemsData: items,
      });
      toast.success("買取を完了しました");
      setStep("complete");
    } catch {
      toast.error("買取の処理に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ["顧客選択", "査定", "確認", "完了"];
  const stepIndex = ["customer", "appraisal", "confirm", "complete"].indexOf(step);

  if (customersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                i <= stepIndex
                  ? "bg-primary text-white"
                  : "bg-muted text-secondary"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm ${
                i <= stepIndex ? "font-medium text-foreground" : "text-secondary"
              }`}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <div className={`h-px w-8 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        {step === "customer" && (
          <CustomerStep
            customers={customers}
            onSelect={handleCustomerSelect}
            onCreateNew={() => router.push(ROUTES.customersNew)}
          />
        )}

        {step === "appraisal" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-secondary">
                顧客: <span className="font-medium text-foreground">{selectedCustomer?.lastName} {selectedCustomer?.firstName}</span>
              </p>
              <Button variant="ghost" size="sm" onClick={() => setStep("customer")}>
                顧客を変更
              </Button>
            </div>
            <AppraisalStep
              items={items}
              onAdd={handleAddItem}
              onRemove={handleRemoveItem}
              onNext={() => setStep("confirm")}
            />
          </div>
        )}

        {step === "confirm" && selectedCustomer && (
          <ConfirmStep
            customer={selectedCustomer}
            items={items}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onConfirm={handleConfirm}
            onBack={() => setStep("appraisal")}
            loading={submitting}
          />
        )}

        {step === "complete" && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
              <svg className="h-8 w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">買取完了</h2>
            <p className="mt-2 text-sm text-secondary">
              {items.length}点の商品が在庫に登録されました
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => router.push(ROUTES.transactions)}>
                取引履歴
              </Button>
              <Button onClick={() => {
                setStep("customer");
                setSelectedCustomer(null);
                setItems([]);
              }}>
                続けて買取
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
