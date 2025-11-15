"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { TripLoad, TripRecord } from "@/types";
import { CheckCircle2, Fuel, MapPin, Package } from "lucide-react";

type TripDetailsProps = {
  trip: TripRecord;
  onAddLoad: () => void;
  onUpdateMileage: () => void;
  onFinishTrip: () => void;
  onEditLoad: (load: TripLoad) => void;
};

export const TripDetailsPanel = ({
  trip,
  onAddLoad,
  onUpdateMileage,
  onFinishTrip,
  onEditLoad,
}: TripDetailsProps) => {
  const mileage = trip.totalMiles.toLocaleString();

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Active trip
        </p>
        <h3 className="font-display text-2xl">
          {formatCurrency(trip.earnings)}
        </h3>
        <p className="text-sm text-white/70">Projected pay • {mileage} miles</p>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-black/10 p-4 text-sm text-white/80">
        <div className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-brand-400" />
          <div>
            <p className="text-xs uppercase text-white/40">Start</p>
            <p>{trip.startOdometer.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-brand-400" />
          <div>
            <p className="text-xs uppercase text-white/40">Current</p>
            <p>{trip.currentOdometer.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-brand-400" />
          <div>
            <p className="text-xs uppercase text-white/40">Loads</p>
            <p>{trip.totalLoads}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-400" />
          <div>
            <p className="text-xs uppercase text-white/40">Stops</p>
            <p>{trip.totalStops}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          className="flex-1"
          onClick={onUpdateMileage}
          variant="secondary"
        >
          Update mileage
        </Button>
        <Button className="flex-1" onClick={onAddLoad} variant="primary">
          Add load
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/60">Loads & stops</p>
          {trip.status === "active" && (
            <button
              className="text-xs text-brand-300 hover:text-brand-100"
              onClick={onFinishTrip}
            >
              Finish trip
            </button>
          )}
        </div>

        {trip.loads.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-4 text-center text-sm text-white/70">
            No loads yet. Tap “Add load” to start logging.
          </div>
        )}

        <div className="space-y-3">
          {trip.loads.map((load) => (
            <button
              key={load.id}
              onClick={() => onEditLoad(load)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-white/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{load.title}</p>
                  <p className="text-xs text-white/50">
                    {load.stopCount} stops • Tap to edit
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-white/30" />
              </div>

              <div className="mt-3 space-y-2 text-xs text-white/60">
                {load.stops.map((stop) => (
                  <div key={stop.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                    <span>{stop.label}</span>
                    {stop.location && (
                      <span className="text-white/35">• {stop.location}</span>
                    )}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
