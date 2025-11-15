"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const StartTripSchema = z.object({
  startOdometer: z
    .number({ invalid_type_error: "Required" })
    .min(0, "Odometer must be positive"),
});

type StartTripValues = z.infer<typeof StartTripSchema>;

export const StartTripForm = ({
  onSubmit,
}: {
  onSubmit: (values: StartTripValues) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StartTripValues>({
    resolver: zodResolver(StartTripSchema),
    defaultValues: {
      startOdometer: 0,
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
    reset();
  });

  return (
    <form className="space-y-5" onSubmit={submitHandler}>
      <div>
        <label className="mb-2 block text-sm text-white/70">
          Current odometer
        </label>
        <Input
          type="number"
          min="0"
          step="1"
          placeholder="Example: 352,140"
          {...register("startOdometer", { valueAsNumber: true })}
        />
        {errors.startOdometer && (
          <p className="mt-1 text-xs text-red-400">
            {errors.startOdometer.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Begin trip
      </Button>
    </form>
  );
};
