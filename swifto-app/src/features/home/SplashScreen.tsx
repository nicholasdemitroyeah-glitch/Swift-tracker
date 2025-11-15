"use client";

import { motion } from "framer-motion";

export const SplashScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-black via-surface to-black text-white">
      <motion.div
        className="relative flex h-28 w-28 items-center justify-center rounded-[32px] bg-brand-500 text-4xl font-bold"
        initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display"
        >
          S
        </motion.span>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm uppercase tracking-[0.35em] text-white/60">
          Swifto
        </p>
        <h1 className="mt-2 font-display text-2xl">Trip & Pay Calculator</h1>
      </motion.div>
    </div>
  );
};
