"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Card = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden border border-white/10 bg-white/5 p-5 text-white shadow-xl",
        className,
      )}
      {...props}
    />
  );
};
