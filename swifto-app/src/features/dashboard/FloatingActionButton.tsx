"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type FabProps = {
  onClick: () => void;
  className?: string;
};

export const FloatingActionButton = ({ onClick, className }: FabProps) => {
  return (
    <Button
      className={cn(
        "fixed bottom-6 right-5 z-40 w-48 justify-center rounded-full bg-brand-500 py-3 text-base font-semibold shadow-orange md:right-12",
        className,
      )}
      onClick={onClick}
    >
      <Plus className="h-4 w-4" />
      Start new trip
    </Button>
  );
};
