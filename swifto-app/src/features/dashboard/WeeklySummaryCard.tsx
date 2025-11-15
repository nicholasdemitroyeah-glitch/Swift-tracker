"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, CalendarDays } from "lucide-react";

type WeeklySummaryCardProps = {
  amount: number;
  label: string;
  tripCount: number;
};

export const WeeklySummaryCard = ({
  amount,
  label,
  tripCount,
}: WeeklySummaryCardProps) => {
  return (
    <Card className="relative overflow-hidden rounded-3xl p-6">
      <div
        className="absolute right-4 top-4 h-16 w-16 rounded-full bg-brand-500/20 blur-2xl"
        aria-hidden
      />
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">
        This week
      </p>
      <h2 className="mt-2 font-display text-3xl">{formatCurrency(amount)}</h2>
      <p className="text-sm text-white/70">{tripCount} trips logged</p>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-brand-300" />
          <div>
            <p className="text-xs uppercase">Pay period</p>
            <p className="text-white/90">{label}</p>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-brand-300" />
      </div>
    </Card>
  );
};
