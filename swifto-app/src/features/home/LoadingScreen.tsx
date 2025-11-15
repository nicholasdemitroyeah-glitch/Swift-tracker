"use client";

export const LoadingScreen = ({
  message = "Syncing your runs...",
}: {
  message?: string;
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-white">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-brand-500" />
      <p className="text-sm text-white/70">{message}</p>
    </div>
  );
};
