"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
  size?: "base" | "lg";
};

export const Modal = ({
  open,
  title,
  onClose,
  children,
  size = "base",
}: ModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 pt-10 md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            layout
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 210, damping: 26 }}
            className={cn(
              "relative w-full rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl md:max-w-2xl",
              size === "lg" && "md:max-w-3xl",
            )}
          >
            {onClose && (
              <button
                className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {title && (
              <h3 className="mb-4 font-display text-xl text-white">{title}</h3>
            )}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
