"use client";

import { useMemo, useState } from "react";
import type { TripLoad, TripRecord, UserSettings } from "@/types";
import { User } from "firebase/auth";
import { useAuth } from "@/providers/AuthProvider";
import { WeeklySummaryCard } from "./WeeklySummaryCard";
import { WeeklyChart } from "./WeeklyChart";
import { TripCard } from "./TripCard";
import { TripDetailsPanel } from "@/features/trips/TripDetailsPanel";
import { PayProfileCard } from "./PayProfileCard";
import { FloatingActionButton } from "./FloatingActionButton";
import { CompletionToast } from "./CompletionToast";
import { Modal } from "@/components/ui/Modal";
import { StartTripForm } from "@/features/trips/StartTripForm";
import { AddLoadForm } from "@/features/trips/AddLoadForm";
import { MileageForm } from "@/features/trips/MileageForm";
import { FinishTripForm } from "@/features/trips/FinishTripForm";
import { LoadEditor } from "@/features/trips/LoadEditor";
import { SettingsForm } from "@/features/settings/SettingsForm";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { getFridayWeekLabel, getFridayWeekStart } from "@/lib/time";
import {
  addLoadToTrip,
  finishTrip,
  startTrip,
  updateLoad,
  updateTripMileage,
} from "@/services/tripService";
import { calculateTripPay } from "@/lib/pay";

type DashboardProps = {
  user: User;
  settings: UserSettings;
  trips: TripRecord[];
  tripsLoading: boolean;
  onUpdateSettings: (values: UserSettings) => Promise<void>;
};

const navSections = ["Dashboard", "Trips", "Loads", "Stops"];

export const Dashboard = ({
  user,
  settings,
  trips,
  tripsLoading,
  onUpdateSettings,
}: DashboardProps) => {
  const { signOut } = useAuth();
  const activeTrip = trips.find((trip) => trip.status === "active") ?? null;

  const [selectedTripId, setSelectedTripId] = useState<string | null>(
    () => activeTrip?.id ?? null,
  );
  const [startTripOpen, setStartTripOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loadTarget, setLoadTarget] = useState<TripRecord | null>(null);
  const [mileageTarget, setMileageTarget] = useState<TripRecord | null>(null);
  const [finishTarget, setFinishTarget] = useState<TripRecord | null>(null);
  const [loadEditorTarget, setLoadEditorTarget] = useState<{
    tripId: string;
    loadId: string;
  } | null>(null);
  const [completionAmount, setCompletionAmount] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tripActionsTarget, setTripActionsTarget] = useState<TripRecord | null>(
    null,
  );
  const selectedTrip = useMemo(() => {
    if (!trips.length) return null;
    if (selectedTripId) {
      const match = trips.find((trip) => trip.id === selectedTripId);
      if (match) return match;
    }
    if (activeTrip) return activeTrip;
    return trips[0];
  }, [activeTrip, selectedTripId, trips]);
  const loadEditor = useMemo(() => {
    if (!loadEditorTarget) return null;
    const trip = trips.find((t) => t.id === loadEditorTarget.tripId);
    if (!trip) return null;
    const load = trip.loads.find((ld) => ld.id === loadEditorTarget.loadId);
    if (!load) return null;
    return { trip, load };
  }, [loadEditorTarget, trips]);

  const currentWeekStart = getFridayWeekStart(new Date()).getTime();
  const currentWeekTrips = trips.filter(
    (trip) => trip.weekStart === currentWeekStart,
  );
  const currentWeekTotal = currentWeekTrips.reduce(
    (sum, trip) => sum + trip.earnings,
    0,
  );

  const chartData = useMemo(() => {
    const grouped = trips.reduce<
      Record<
        number,
        {
          label: string;
          total: number;
          mileagePay: number;
          loadPay: number;
          stopPay: number;
        }
      >
    >((acc, trip) => {
      if (!acc[trip.weekStart]) {
        acc[trip.weekStart] = {
          label: getFridayWeekLabel(new Date(trip.weekStart)),
          total: 0,
          mileagePay: 0,
          loadPay: 0,
          stopPay: 0,
        };
      }
      acc[trip.weekStart].total += trip.earnings;
      acc[trip.weekStart].mileagePay += trip.mileagePay;
      acc[trip.weekStart].loadPay += trip.loadPay;
      acc[trip.weekStart].stopPay += trip.stopPay;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([weekStart, payload]) => ({
        weekStart: Number(weekStart),
        ...payload,
      }))
      .sort((a, b) => a.weekStart - b.weekStart)
      .slice(-6);
  }, [trips]);

  const handleStartTrip = async ({
    startOdometer,
  }: {
    startOdometer: number;
  }) => {
    try {
      await startTrip({
        userId: user.uid,
        startOdometer,
        snapshot: {
          cpm: settings.cpm,
          payPerLoad: settings.payPerLoad,
          payPerStop: settings.payPerStop,
          capturedAt: Date.now(),
        },
      });
      setStatusMessage("Trip started");
      setStartTripOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to start trip – double check your connection.");
    }
  };

  const handleAddLoad = async ({
    title,
    stopCount,
  }: {
    title: string;
    stopCount: number;
  }) => {
    if (!loadTarget) return;
    try {
      await addLoadToTrip({
        userId: user.uid,
        tripId: loadTarget.id,
        title,
        stopCount,
      });
      setStatusMessage("Load added");
      setLoadTarget(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to add load right now.");
    }
  };

  const handleMileageUpdate = async ({ odometer }: { odometer: number }) => {
    if (!mileageTarget) return;
    try {
      await updateTripMileage({
        userId: user.uid,
        tripId: mileageTarget.id,
        odometer,
      });
      setStatusMessage("Mileage updated");
      setMileageTarget(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Mileage update failed.");
    }
  };

  const handleFinishTrip = async ({
    finalOdometer,
  }: {
    finalOdometer: number;
  }) => {
    if (!finishTarget) return;
    try {
      const breakdown = calculateTripPay({
        miles: Math.max(0, finalOdometer - finishTarget.startOdometer),
        loads: finishTarget.loads,
        snapshot: finishTarget.paySnapshot,
      });

      await finishTrip({
        userId: user.uid,
        tripId: finishTarget.id,
        finalOdometer,
      });
      setCompletionAmount(breakdown.total);
      setFinishTarget(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to finish the trip yet.");
    }
  };

  const handleLoadSave = async (load: TripLoad) => {
    if (!loadEditor) return;
    try {
      await updateLoad({
        userId: user.uid,
        tripId: loadEditor.trip.id,
        load,
      });
      setStatusMessage("Load updated");
      setLoadEditorTarget(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Load update failed.");
    }
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-32 pt-10 text-white md:px-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Swifto
          </p>
          <h1 className="font-display text-4xl">Trip & Pay dashboard</h1>
          <p className="text-sm text-white/60">
            Track every mile, load, and stop. Payday hits every Friday.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70">
            {user.displayName ?? "Driver"}
          </div>
          <Button variant="ghost" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        {navSections.map((section) => (
          <button
            key={section}
            className="rounded-full border border-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-white/60 hover:border-white/40"
          >
            {section}
          </button>
        ))}
      </div>

      {statusMessage && (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {statusMessage}
          <button
            className="ml-4 text-white/70"
            onClick={() => setStatusMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
          <button
            className="ml-4 text-white/70"
            onClick={() => setErrorMessage(null)}
          >
            Clear
          </button>
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <WeeklySummaryCard
          amount={currentWeekTotal}
          label={getFridayWeekLabel(new Date())}
          tripCount={currentWeekTrips.length}
        />
        <PayProfileCard
          settings={settings}
          onEdit={() => setSettingsOpen(true)}
        />
      </section>

      <section>
        <WeeklyChart data={chartData} />
      </section>

      <section className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Trips</h2>
            {tripsLoading && <p className="text-xs text-white/50">Syncing…</p>}
          </div>
          {trips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 p-6 text-center text-sm text-white/70">
              No trips yet. Tap the orange button to start your first run.
            </div>
          ) : (
            <div className="grid gap-4">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  active={selectedTrip?.id === trip.id}
                  onSelect={() => setSelectedTripId(trip.id)}
                  onEdit={() => {
                    setSelectedTripId(trip.id);
                    setTripActionsTarget(trip);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {selectedTrip ? (
            <TripDetailsPanel
              trip={selectedTrip}
              onAddLoad={() => setLoadTarget(selectedTrip)}
              onUpdateMileage={() => setMileageTarget(selectedTrip)}
              onFinishTrip={() => setFinishTarget(selectedTrip)}
              onEditLoad={(load) =>
                setLoadEditorTarget({
                  tripId: selectedTrip.id,
                  loadId: load.id,
                })
              }
            />
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              Select a trip to view loads, stops, and payouts.
            </div>
          )}
        </div>
      </section>

      <FloatingActionButton onClick={() => setStartTripOpen(true)} />

      <Modal
        open={startTripOpen}
        onClose={() => setStartTripOpen(false)}
        title="Start a new trip"
        size="lg"
      >
        <StartTripForm onSubmit={handleStartTrip} />
      </Modal>

      <Modal
        open={Boolean(loadTarget)}
        onClose={() => setLoadTarget(null)}
        title="Add load"
        size="lg"
      >
        {loadTarget && <AddLoadForm onSubmit={handleAddLoad} />}
        {loadTarget && (
          <p className="mt-4 text-xs text-white/60">
            Trip projected pay: {formatCurrency(loadTarget.earnings)} · Loads:{" "}
            {loadTarget.totalLoads}
          </p>
        )}
      </Modal>

      <Modal
        open={Boolean(mileageTarget)}
        onClose={() => setMileageTarget(null)}
        title="Update mileage"
      >
        {mileageTarget && (
          <MileageForm
            defaultValue={mileageTarget.currentOdometer}
            onSubmit={handleMileageUpdate}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(finishTarget)}
        onClose={() => setFinishTarget(null)}
        title="Finish trip"
        size="lg"
      >
        {finishTarget && (
          <>
            <p className="mb-4 text-sm text-white/70">
              Current projected pay:{" "}
              <span className="font-semibold">
                {formatCurrency(finishTarget.earnings)}
              </span>
            </p>
            <FinishTripForm
              defaultValue={finishTarget.currentOdometer}
              onSubmit={handleFinishTrip}
            />
          </>
        )}
      </Modal>

      <Modal
        open={Boolean(loadEditor)}
        onClose={() => setLoadEditorTarget(null)}
        title="Edit load"
        size="lg"
      >
        {loadEditor && (
          <LoadEditor load={loadEditor.load} onSave={handleLoadSave} />
        )}
      </Modal>

      <Modal
        open={Boolean(tripActionsTarget)}
        onClose={() => setTripActionsTarget(null)}
        title="Trip actions"
      >
        {tripActionsTarget && (
          <div className="space-y-3">
            <Button
              className="w-full justify-center"
              onClick={() => {
                setLoadTarget(tripActionsTarget);
                setTripActionsTarget(null);
              }}
            >
              Add load
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => {
                setMileageTarget(tripActionsTarget);
                setTripActionsTarget(null);
              }}
            >
              Update mileage
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => {
                setFinishTarget(tripActionsTarget);
                setTripActionsTarget(null);
              }}
            >
              Finish trip
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => {
                setSelectedTripId(tripActionsTarget.id);
                if (tripActionsTarget.loads.length > 0) {
                  setLoadEditorTarget({
                    tripId: tripActionsTarget.id,
                    loadId: tripActionsTarget.loads[0].id,
                  });
                } else {
                  setLoadTarget(tripActionsTarget);
                }
                setTripActionsTarget(null);
              }}
            >
              Manage loads & stops
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Pay settings"
      >
        <SettingsForm
          initialValues={settings}
          onSave={async (values) => {
            await onUpdateSettings(values);
            setSettingsOpen(false);
          }}
        />
      </Modal>

      <CompletionToast
        amount={completionAmount}
        onClose={() => setCompletionAmount(null)}
      />
    </div>
  );
};
