"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useItems } from "@/hooks/useItems";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { ItemForm, type ItemFormData } from "@/components/items/ItemForm";
import { ROUTES } from "@/constants/routes";

export default function ItemNewPage() {
  const [loading, setLoading] = useState(false);
  const { createItem } = useItems();
  const { user, profile } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (data: ItemFormData) => {
    setLoading(true);
    try {
      await createItem({
        ...data,
        customerId: "",
        purchaseTransactionId: "",
        photoUrls: [],
        status: "in_stock",
        registeredBy: profile?.displayName ?? user?.displayName ?? "スタッフ",
      });
      toast.success("商品を登録しました");
      router.push(ROUTES.items);
    } catch {
      toast.error("商品の登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="在庫登録">
      <ItemForm onSubmit={handleSubmit} loading={loading} />
    </Card>
  );
}
