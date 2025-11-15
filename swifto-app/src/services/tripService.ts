import { firestore } from "@/lib/firebase";
import { calculateTripPay } from "@/lib/pay";
import { getFridayWeekStart } from "@/lib/time";
import type {
  AddLoadPayload,
  FinishTripPayload,
  StartTripPayload,
  TripLoad,
  TripRecord,
  UpdateLoadPayload,
  UpdateMileagePayload,
} from "@/types";
import { collection, doc, runTransaction, setDoc } from "firebase/firestore";

const tripsCollection = (userId: string) =>
  collection(firestore, "users", userId, "trips");

const buildStops = (count: number): TripLoad["stops"] => {
  const stops: TripLoad["stops"] = [];
  for (let i = 0; i < count; i += 1) {
    stops.push({
      id: crypto.randomUUID(),
      label: `Stop ${i + 1}`,
      notes: "",
      location: "",
      status: "planned",
      updatedAt: Date.now(),
    });
  }
  return stops;
};

const recalcTrip = (trip: TripRecord, overrides?: Partial<TripRecord>) => {
  const nextState = { ...trip, ...overrides };
  const miles = Math.max(
    0,
    (nextState.currentOdometer ?? trip.currentOdometer) -
      nextState.startOdometer,
  );
  const loads = nextState.loads ?? [];
  const breakdown = calculateTripPay({
    miles,
    loads,
    snapshot: nextState.paySnapshot,
  });

  const totalStops = loads.reduce((acc, ld) => acc + (ld.stopCount || 0), 0);

  return {
    totalMiles: miles,
    totalLoads: loads.length,
    totalStops,
    mileagePay: breakdown.mileagePay,
    loadPay: breakdown.loadPay,
    stopPay: breakdown.stopPay,
    earnings: breakdown.total,
  };
};

export const startTrip = async ({
  userId,
  startOdometer,
  snapshot,
}: StartTripPayload) => {
  const tripId = crypto.randomUUID();
  const now = Date.now();
  const weekStart = getFridayWeekStart(new Date()).getTime();

  const trip: TripRecord = {
    id: tripId,
    userId,
    status: "active",
    startOdometer,
    currentOdometer: startOdometer,
    startedAt: now,
    weekStart,
    loads: [],
    totalMiles: 0,
    totalLoads: 0,
    totalStops: 0,
    paySnapshot: snapshot,
    earnings: 0,
    mileagePay: 0,
    loadPay: 0,
    stopPay: 0,
    updatedAt: now,
  };

  const docRef = doc(tripsCollection(userId), tripId);
  await setDoc(docRef, trip);
  return trip;
};

export const addLoadToTrip = async ({
  userId,
  tripId,
  title,
  stopCount,
}: AddLoadPayload) => {
  const tripRef = doc(tripsCollection(userId), tripId);

  await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(tripRef);
    if (!snap.exists()) {
      throw new Error("Trip was not found");
    }

    const trip = snap.data() as TripRecord;
    if (trip.status === "completed") {
      throw new Error("Trip is already completed");
    }

    const newLoad: TripLoad = {
      id: crypto.randomUUID(),
      title: title || `Load ${trip.loads.length + 1}`,
      stopCount,
      stops: buildStops(stopCount),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const loads = [...(trip.loads ?? []), newLoad];
    const recalculated = recalcTrip(trip, { loads });

    tx.update(tripRef, {
      loads,
      ...recalculated,
      updatedAt: Date.now(),
    });
  });
};

export const updateLoad = async ({
  userId,
  tripId,
  load,
}: UpdateLoadPayload) => {
  const tripRef = doc(tripsCollection(userId), tripId);

  await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(tripRef);
    if (!snap.exists()) {
      throw new Error("Trip was not found");
    }

    const trip = snap.data() as TripRecord;
    const loads = [...(trip.loads ?? [])];
    const idx = loads.findIndex((ld) => ld.id === load.id);
    if (idx === -1) {
      throw new Error("Load not found");
    }

    loads[idx] = {
      ...load,
      stopCount: load.stops.length,
      updatedAt: Date.now(),
    };

    const recalculated = recalcTrip(trip, { loads });

    tx.update(tripRef, {
      loads,
      ...recalculated,
      updatedAt: Date.now(),
    });
  });
};

export const updateTripMileage = async ({
  userId,
  tripId,
  odometer,
}: UpdateMileagePayload) => {
  const tripRef = doc(tripsCollection(userId), tripId);

  await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(tripRef);
    if (!snap.exists()) {
      throw new Error("Trip was not found");
    }

    const trip = snap.data() as TripRecord;
    const overrides = {
      currentOdometer: odometer,
    };
    const recalculated = recalcTrip(trip, overrides);

    tx.update(tripRef, {
      currentOdometer: odometer,
      ...recalculated,
      updatedAt: Date.now(),
    });
  });
};

export const finishTrip = async ({
  userId,
  tripId,
  finalOdometer,
}: FinishTripPayload) => {
  const tripRef = doc(tripsCollection(userId), tripId);

  await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(tripRef);
    if (!snap.exists()) {
      throw new Error("Trip was not found");
    }

    const trip = snap.data() as TripRecord;
    const overrides = {
      currentOdometer: finalOdometer,
      endOdometer: finalOdometer,
      status: "completed" as const,
      completedAt: Date.now(),
    };
    const recalculated = recalcTrip(trip, overrides);

    tx.update(tripRef, {
      ...overrides,
      ...recalculated,
      updatedAt: Date.now(),
    });
  });
};
