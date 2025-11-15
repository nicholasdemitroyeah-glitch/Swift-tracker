"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { UserSettings } from "@/types";
import { Cog } from "lucide-react";

type PayProfileCardProps = {
  settings: UserSettings;
  onEdit: () => void;
};

export const PayProfileCard = ({ settings, onEdit }: PayProfileCardProps) => {
  return (
    <Card className="rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">Pay profile</h3>
        <button
          className="rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10"
          onClick={onEdit}
        >
          <Cog className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-white/80">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase text-white/40">CPM</p>
          <p className="text-lg font-semibold">{settings.cpm}¢</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase text-white/40">Per load</p>
          <p className="text-lg font-semibold">
            {formatCurrency(settings.payPerLoad)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase text-white/40">Per stop</p>
          <p className="text-lg font-semibold">
            {formatCurrency(settings.payPerStop)}
          </p>
        </div>
      </div>
    </Card>
  );
};
