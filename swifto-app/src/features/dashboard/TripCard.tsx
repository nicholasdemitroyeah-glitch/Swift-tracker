"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { TripRecord } from "@/types";
import {
  CalendarDays,
  ChevronRight,
  Fuel,
  MapPin,
  PencilLine,
} from "lucide-react";

type TripCardProps = {
  trip: TripRecord;
  active?: boolean;
  onSelect: () => void;
  onEdit: () => void;
};

export const TripCard = ({ trip, active, onSelect, onEdit }: TripCardProps) => {
  const statusChip =
    trip.status === "active"
      ? "bg-emerald-500/20 text-emerald-200"
      : "bg-white/15 text-white/60 border border-white/20";

  return (
    <Card
      className={`relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 p-5 transition hover:border-white/30 ${active ? "ring-2 ring-brand-400" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            {trip.status}
          </p>
          <h3 className="mt-1 font-display text-2xl">
            {formatCurrency(trip.earnings)}
          </h3>
        </div>
        <button
          className="rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          <PencilLine className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/70">
        <span className={`rounded-full px-3 py-1 ${statusChip}`}>
          {trip.status === "active" ? "In progress" : "Closed"}
        </span>
        <span className="flex items-center gap-1">
          <Fuel className="h-3.5 w-3.5 text-brand-300" />
          {trip.totalMiles.toLocaleString()} mi
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-brand-300" />
          {trip.totalStops} stops
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5 text-brand-300" />
          {new Date(trip.startedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-white/80">
        <div>
          <p className="text-xs text-white/50">Loads</p>
          <p>{trip.totalLoads}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-white/30" />
      </div>
    </Card>
  );
};
