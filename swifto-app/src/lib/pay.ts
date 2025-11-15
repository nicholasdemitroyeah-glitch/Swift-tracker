import type { PaySnapshot, TripLoad } from "@/types";

export type PayBreakdown = {
  mileagePay: number;
  loadPay: number;
  stopPay: number;
  total: number;
};

export const calculateTripPay = ({
  miles,
  loads,
  snapshot,
}: {
  miles: number;
  loads: TripLoad[];
  snapshot: PaySnapshot;
}): PayBreakdown => {
  const totalStops = loads.reduce(
    (acc, load) => acc + (load.stopCount || 0),
    0,
  );
  const loadCount = loads.length;

  const mileagePay = (miles || 0) * ((snapshot?.cpm ?? 0) / 100);
  const loadPay = loadCount * (snapshot?.payPerLoad ?? 0);
  const stopPay = totalStops * (snapshot?.payPerStop ?? 0);
  const total = mileagePay + loadPay + stopPay;

  return {
    mileagePay,
    loadPay,
    stopPay,
    total,
  };
};
