"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

type LoginScreenProps = {
  onSignIn: () => Promise<void>;
};

export const LoginScreen = ({ onSignIn }: LoginScreenProps) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#0f172a,#0b1120,#080b14)]" />
      <motion.div
        className="absolute inset-0 opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2 }}
      >
        <div className="blurred-bg h-full w-full" />
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">
          Swifto
        </p>
        <h1 className="mt-3 font-display text-3xl">Trip & Pay calculator</h1>
        <p className="mt-4 text-sm text-white/70">
          Sign in with Google to keep your trips, loads, stops, and settings
          synced everywhere.
        </p>

        <Button className="mt-8 w-full justify-center" onClick={onSignIn}>
          <LogIn className="h-4 w-4" />
          Continue with Google
        </Button>

        <p className="mt-4 text-xs text-white/50">
          Built for Swift drivers to protect every penny.
        </p>
      </motion.div>
    </div>
  );
};
