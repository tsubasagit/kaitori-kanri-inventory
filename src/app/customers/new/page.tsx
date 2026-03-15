"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomers } from "@/hooks/useCustomers";
import { Card } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { ROUTES } from "@/constants/routes";

export default function CustomerNewPage() {
  const [loading, setLoading] = useState(false);
  const { createCustomer } = useCustomers();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (data: Parameters<typeof createCustomer>[0]) => {
    setLoading(true);
    try {
      await createCustomer(data);
      toast.success("顧客を登録しました");
      router.push(ROUTES.customers);
    } catch {
      toast.error("顧客の登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="顧客登録">
      <CustomerForm onSubmit={handleSubmit} loading={loading} />
    </Card>
  );
}
