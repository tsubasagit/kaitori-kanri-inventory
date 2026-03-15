"use client";

import { useState, useMemo } from "react";
import { Button, Input, Badge, Card } from "@/components/ui";
import { Customer } from "@/types";
import { CUSTOMER_TYPE_LABELS } from "@/constants/statuses";

type CustomerStepProps = {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  onCreateNew: () => void;
};

export function CustomerStep({ customers, onSelect, onCreateNew }: CustomerStepProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return customers.slice(0, 10);
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        `${c.lastName}${c.firstName}`.includes(q) ||
        `${c.lastNameKana}${c.firstNameKana}`.includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, search]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onCreateNew}
        className="flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-primary bg-primary-light/50 p-5 text-left transition-colors hover:bg-primary-light"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>
        <div>
          <p className="text-base font-bold text-primary">新規顧客登録</p>
          <p className="text-sm text-primary/70">初めてのお客様はこちらから登録してください</p>
        </div>
      </button>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="氏名・カナ・電話番号で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="py-4 text-center text-sm text-secondary">
            顧客が見つかりません
          </p>
        ) : (
          filtered.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => onSelect(customer)}
              className="w-full rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {customer.lastName} {customer.firstName}
                    <span className="ml-2 text-sm text-secondary">
                      {customer.lastNameKana} {customer.firstNameKana}
                    </span>
                  </p>
                  <p className="text-sm text-secondary">{customer.phone}</p>
                  {customer.address && (
                    <p className="text-xs text-secondary">{customer.address}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge>{CUSTOMER_TYPE_LABELS[customer.customerType]}</Badge>
                  {customer.identityVerified ? (
                    <Badge color="var(--success)" bgColor="var(--success-light)">
                      本人確認済み
                    </Badge>
                  ) : (
                    <Badge color="var(--warning)" bgColor="var(--warning-light)">
                      未確認
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
