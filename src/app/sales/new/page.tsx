"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useItems } from "@/hooks/useItems";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { Card, Button, Spinner } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { ItemScanner } from "@/components/sales/ItemScanner";
import { Cart } from "@/components/sales/Cart";
import { CheckoutSummary } from "@/components/sales/CheckoutSummary";
import { Item, PaymentMethod } from "@/types";
import { ROUTES } from "@/constants/routes";

export default function SalesNewPage() {
  const { items, loading: itemsLoading } = useItems();
  const { createSaleTransaction } = useTransactions();
  const { user, profile } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleAddToCart = (item: Item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleCheckout = async (params: {
    paymentMethod: PaymentMethod;
    amountReceived: number;
    change: number;
  }) => {
    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      const total = cartItems.reduce((sum, item) => sum + item.sellingPrice, 0);
      await createSaleTransaction({
        customerId: "",
        customerName: "",
        items: cartItems.map((item) => ({
          itemId: item.id,
          itemName: item.name,
          brand: item.brand,
          price: item.sellingPrice,
        })),
        total,
        paymentMethod: params.paymentMethod,
        amountReceived: params.amountReceived,
        change: params.change,
        staffId: user?.uid ?? "",
        staffName: profile?.displayName ?? "スタッフ",
        note: "",
      });
      toast.success("販売を完了しました");
      setCompleted(true);
    } catch {
      toast.error("販売の処理に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (itemsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (completed) {
    return (
      <Card>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
            <svg className="h-8 w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">販売完了</h2>
          <p className="mt-2 text-sm text-secondary">
            {cartItems.length}点の商品を販売しました
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.push(ROUTES.transactions)}>
              取引履歴
            </Button>
            <Button onClick={() => {
              setCartItems([]);
              setShowCheckout(false);
              setCompleted(false);
            }}>
              続けて販売
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card title="商品検索">
        <ItemScanner
          items={items}
          onSelect={handleAddToCart}
          cartItemIds={cartItems.map((i) => i.id)}
        />
      </Card>

      <div className="space-y-4">
        <Card title={`カート（${cartItems.length}点）`}>
          <Cart items={cartItems} onRemove={handleRemoveFromCart} />
          {cartItems.length > 0 && !showCheckout && (
            <div className="mt-4">
              <Button className="w-full" onClick={() => setShowCheckout(true)}>
                会計へ進む
              </Button>
            </div>
          )}
        </Card>

        {showCheckout && cartItems.length > 0 && (
          <Card title="お会計">
            <CheckoutSummary
              items={cartItems}
              onConfirm={handleCheckout}
              loading={submitting}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
