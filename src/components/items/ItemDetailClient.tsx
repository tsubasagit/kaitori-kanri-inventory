"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useItems } from "@/hooks/useItems";
import { Card, Button, Badge, Spinner, Select } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { ItemForm, type ItemFormData } from "@/components/items/ItemForm";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { Item, ItemStatus } from "@/types";
import { CATEGORY_LABELS } from "@/constants/categories";
import { CONDITION_LABELS, ITEM_STATUS_LABELS } from "@/constants/statuses";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { ROUTES } from "@/constants/routes";
import { QRCodeSVG } from "qrcode.react";

export default function ItemDetailClient() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { getItem, updateItem } = useItems();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    getItem(id).then((i) => {
      setItem(i);
      setLoading(false);
    });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (newStatus: ItemStatus) => {
    setSaving(true);
    try {
      await updateItem(id, { status: newStatus });
      const updated = await getItem(id);
      setItem(updated);
      toast.success("ステータスを更新しました");
    } catch {
      toast.error("ステータスの更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <Card>
        <p className="text-center text-secondary">商品が見つかりません</p>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => router.push(ROUTES.items)}>
            一覧に戻る
          </Button>
        </div>
      </Card>
    );
  }

  if (editing) {
    const handleUpdate = async (data: ItemFormData) => {
      setSaving(true);
      try {
        await updateItem(id, data);
        const updated = await getItem(id);
        setItem(updated);
        setEditing(false);
        toast.success("商品情報を更新しました");
      } catch {
        toast.error("更新に失敗しました");
      } finally {
        setSaving(false);
      }
    };

    return (
      <Card
        title="商品編集"
        action={
          <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
            キャンセル
          </Button>
        }
      >
        <ItemForm
          initialData={item}
          onSubmit={handleUpdate}
          loading={saving}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        title={item.name}
        action={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setEditing(true)}>
              編集
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-secondary">ブランド</p>
            <p className="text-sm font-medium">{item.brand || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">カテゴリ</p>
            <p className="text-sm">{CATEGORY_LABELS[item.category] || item.category}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">サブカテゴリ</p>
            <p className="text-sm">{item.subcategory || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">サイズ</p>
            <p className="text-sm">{item.size || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">カラー</p>
            <p className="text-sm">{item.color || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">コンディション</p>
            <Badge>{CONDITION_LABELS[item.condition]}</Badge>
          </div>
          <div>
            <p className="text-xs text-secondary">買取価格</p>
            <p className="text-sm font-medium">{formatCurrency(item.purchasePrice)}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">販売価格</p>
            <p className="text-sm font-medium text-primary">{formatCurrency(item.sellingPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">粗利</p>
            <p className={`text-sm font-medium ${item.sellingPrice - item.purchasePrice >= 0 ? "text-success" : "text-danger"}`}>
              {formatCurrency(item.sellingPrice - item.purchasePrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary">登録者</p>
            <p className="text-sm">{item.registeredBy || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">登録日</p>
            <p className="text-sm">{formatDate(item.createdAt)}</p>
          </div>
        </div>
      </Card>

      {item.barcode && (
        <Card title="QRコード / バーコード">
          <div className="flex items-center gap-6">
            <div className="shrink-0 rounded-lg bg-white p-3">
              <QRCodeSVG value={item.barcode} size={120} />
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-foreground">{item.barcode}</p>
              <p className="mt-1 text-sm text-secondary">販売レジでこのQRコードをスキャンすると、カートに追加できます</p>
            </div>
          </div>
        </Card>
      )}

      <Card title="ステータス変更">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-secondary">現在のステータス</p>
            <div className="mt-1">
              <ItemStatusBadge status={item.status} />
            </div>
          </div>
          <div className="flex-1">
            <Select
              label="変更先"
              value={item.status}
              onChange={(e) => handleStatusChange(e.target.value as ItemStatus)}
              options={Object.entries(ITEM_STATUS_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
              disabled={saving}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
