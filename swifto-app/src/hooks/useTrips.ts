"use client";

import { firestore } from "@/lib/firebase";
import type { TripRecord } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { startTransition, useEffect, useMemo, useState } from "react";

export const useTrips = (userId?: string) => {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      startTransition(() => {
        setTrips([]);
        setLoading(false);
      });
      return;
    }

    const tripsRef = collection(firestore, "users", userId, "trips");
    const tripsQuery = query(tripsRef, orderBy("startedAt", "desc"));

    const unsubscribe = onSnapshot(tripsQuery, (snapshot) => {
      const nextTrips = snapshot.docs.map((doc) => doc.data() as TripRecord);
      startTransition(() => {
        setTrips(nextTrips);
        setLoading(false);
      });
    });

    return unsubscribe;
  }, [userId]);

  const activeTrip = useMemo(
    () => trips.find((trip) => trip.status === "active") ?? null,
    [trips],
  );
  const completedTrips = useMemo(
    () => trips.filter((trip) => trip.status === "completed"),
    [trips],
  );

  return {
    trips,
    loading,
    activeTrip,
    completedTrips,
  };
};
