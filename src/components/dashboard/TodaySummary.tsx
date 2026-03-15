"use client";

import { Card } from "@/components/ui";
import { formatCurrency } from "@/utils/currency";

type SummaryData = {
  todaySales: number;
  todaySalesCount: number;
  todayPurchases: number;
  todayPurchasesCount: number;
  totalStock: number;
};

export function TodaySummary({ data }: { data: SummaryData }) {
  const cards = [
    {
      label: "本日の売上",
      value: formatCurrency(data.todaySales),
      sub: `${data.todaySalesCount}件`,
      color: "text-success",
      bg: "bg-success-light",
    },
    {
      label: "本日の買取",
      value: formatCurrency(data.todayPurchases),
      sub: `${data.todayPurchasesCount}件`,
      color: "text-primary",
      bg: "bg-primary-light",
    },
    {
      label: "在庫数",
      value: `${data.totalStock}点`,
      sub: "在庫あり",
      color: "text-warning",
      bg: "bg-warning-light",
    },
    {
      label: "本日粗利",
      value: formatCurrency(data.todaySales - data.todayPurchases),
      sub: "売上 - 買取",
      color: data.todaySales - data.todayPurchases >= 0 ? "text-success" : "text-danger",
      bg: data.todaySales - data.todayPurchases >= 0 ? "bg-success-light" : "bg-danger-light",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
              <span className={`text-lg font-bold ${card.color}`}>
                {card.label.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-xs text-secondary">{card.label}</p>
              <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-secondary">{card.sub}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
