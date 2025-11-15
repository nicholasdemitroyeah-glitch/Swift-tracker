import { addDays, startOfDay } from "date-fns";

export const getFridayWeekStart = (value: Date = new Date()): Date => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // Sunday = 0
  const daysSinceFriday = (day + 2) % 7;
  return addDays(startOfDay(date), -daysSinceFriday);
};

export const getFridayWeekLabel = (value: Date = new Date()) => {
  const start = getFridayWeekStart(value);
  const end = addDays(start, 6);

  return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(
    undefined,
    { month: "short", day: "numeric" },
  )}`;
};
