"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

const actions = [
  {
    label: "販売（レジ）",
    href: ROUTES.salesNew,
    description: "商品を販売する",
    color: "bg-success-light text-success",
  },
  {
    label: "買取",
    href: ROUTES.purchase,
    description: "商品を買い取る",
    color: "bg-primary-light text-primary",
  },
  {
    label: "在庫登録",
    href: ROUTES.itemsNew,
    description: "新しい商品を登録",
    color: "bg-warning-light text-warning",
  },
  {
    label: "顧客登録",
    href: ROUTES.customersNew,
    description: "新しい顧客を登録",
    color: "bg-danger-light text-danger",
  },
];

export function QuickActions() {
  return (
    <Card title="クイックアクション">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:bg-muted"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
              <span className="text-lg font-bold">{action.label.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="text-xs text-secondary">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
