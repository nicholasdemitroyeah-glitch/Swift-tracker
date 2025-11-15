"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { UserSettings } from "@/types";
import { useAuth } from "@/providers/AuthProvider";

type SettingsContextValue = {
  settings: UserSettings | null;
  loading: boolean;
  saveSettings: (values: UserSettings) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      startTransition(() => {
        setSettings(null);
        setLoading(false);
      });
      return;
    }

    const settingsRef = doc(firestore, "users", user.uid);
    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      const data = snapshot.data() as { settings?: UserSettings } | undefined;
      startTransition(() => {
        setSettings(data?.settings ?? null);
        setLoading(false);
      });
    });

    return unsubscribe;
  }, [user]);

  const saveSettings = useCallback(
    async (values: UserSettings) => {
      if (!user) return;
      const now = Date.now();

      const payload: UserSettings = {
        ...values,
        createdAt: settings?.createdAt ?? now,
        updatedAt: now,
      };

      const settingsRef = doc(firestore, "users", user.uid);
      await setDoc(
        settingsRef,
        {
          settings: payload,
        },
        { merge: true },
      );
    },
    [settings?.createdAt, user],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      loading,
      saveSettings,
    }),
    [loading, saveSettings, settings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
