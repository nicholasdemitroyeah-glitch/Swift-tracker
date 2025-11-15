export type UserSettings = {
  cpm: number; // cents per mile
  payPerLoad: number;
  payPerStop: number;
  createdAt?: number;
  updatedAt?: number;
};

export type PaySnapshot = {
  cpm: number;
  payPerLoad: number;
  payPerStop: number;
  capturedAt: number;
};

export type TripLoadStop = {
  id: string;
  label: string;
  location?: string;
  notes?: string;
  status?: "planned" | "arrived" | "departed" | "completed";
  updatedAt: number;
};

export type TripLoad = {
  id: string;
  title: string;
  stopCount: number;
  stops: TripLoadStop[];
  createdAt: number;
  updatedAt: number;
};

export type TripRecord = {
  id: string;
  userId: string;
  status: "active" | "completed";
  startOdometer: number;
  currentOdometer: number;
  endOdometer?: number;
  startedAt: number;
  completedAt?: number;
  weekStart: number;
  loads: TripLoad[];
  totalMiles: number;
  totalLoads: number;
  totalStops: number;
  paySnapshot: PaySnapshot;
  earnings: number;
  mileagePay: number;
  loadPay: number;
  stopPay: number;
  updatedAt: number;
};

export type StartTripPayload = {
  userId: string;
  startOdometer: number;
  snapshot: PaySnapshot;
};

export type AddLoadPayload = {
  userId: string;
  tripId: string;
  title: string;
  stopCount: number;
};

export type UpdateMileagePayload = {
  userId: string;
  tripId: string;
  odometer: number;
};

export type FinishTripPayload = {
  userId: string;
  tripId: string;
  finalOdometer: number;
};

export type UpdateLoadPayload = {
  userId: string;
  tripId: string;
  load: TripLoad;
};
