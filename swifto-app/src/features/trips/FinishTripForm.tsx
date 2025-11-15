"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FinishSchema = z.object({
  finalOdometer: z
    .number({ invalid_type_error: "Required" })
    .min(0, "Odometer must be positive"),
});

type FinishValues = z.infer<typeof FinishSchema>;

export const FinishTripForm = ({
  defaultValue,
  onSubmit,
}: {
  defaultValue: number;
  onSubmit: (values: FinishValues) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FinishValues>({
    resolver: zodResolver(FinishSchema),
    defaultValues: {
      finalOdometer: defaultValue,
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form className="space-y-5" onSubmit={submitHandler}>
      <div>
        <label className="mb-2 block text-sm text-white/70">
          Final odometer
        </label>
        <Input
          type="number"
          min="0"
          {...register("finalOdometer", { valueAsNumber: true })}
        />
        {errors.finalOdometer && (
          <p className="mt-1 text-xs text-red-400">
            {errors.finalOdometer.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Finish trip
      </Button>
    </form>
  );
};
