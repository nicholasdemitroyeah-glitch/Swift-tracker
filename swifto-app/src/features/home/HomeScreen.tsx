"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useSettings } from "@/providers/SettingsProvider";
import { useTrips } from "@/hooks/useTrips";
import { SplashScreen } from "./SplashScreen";
import { LoadingScreen } from "./LoadingScreen";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { SettingsForm } from "@/features/settings/SettingsForm";
import { Dashboard } from "@/features/dashboard/Dashboard";

export const HomeScreen = () => {
  const { user, loading: authLoading, signIn } = useAuth();
  const { settings, loading: settingsLoading, saveSettings } = useSettings();
  const { trips, loading: tripsLoading } = useTrips(user?.uid);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  if (authLoading) {
    return <LoadingScreen message="Checking your credentials..." />;
  }

  if (!user) {
    return <LoginScreen onSignIn={signIn} />;
  }

  if (settingsLoading) {
    return <LoadingScreen message="Loading your pay profile..." />;
  }

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Welcome
          </p>
          <h2 className="mt-3 font-display text-2xl">Set your rates</h2>
          <p className="mt-2 text-sm text-white/65">
            Swifto needs your CPM plus load & stop pay so we can calculate every
            trip automatically.
          </p>
          <div className="mt-6">
            <SettingsForm
              onSave={saveSettings}
              submitLabel="Save & open dashboard"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      user={user}
      settings={settings}
      trips={trips}
      tripsLoading={tripsLoading}
      onUpdateSettings={saveSettings}
    />
  );
};
