"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

type CompletionToastProps = {
  amount: number | null;
  onClose: () => void;
};

export const CompletionToast = ({ amount, onClose }: CompletionToastProps) => {
  return (
    <AnimatePresence>
      {amount !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-brand-500/30 to-black/70 p-8 text-center shadow-2xl backdrop-blur-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <CheckCheck className="h-8 w-8 text-brand-300" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-white/60">
              Trip closed
            </p>
            <h3 className="mt-3 font-display text-3xl">
              {formatCurrency(amount)}
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Final payout locked in. Depositing this Friday.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
