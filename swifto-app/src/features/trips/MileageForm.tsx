"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MileageSchema = z.object({
  odometer: z
    .number({ invalid_type_error: "Required" })
    .min(0, "Odometer must be positive"),
});

type MileageValues = z.infer<typeof MileageSchema>;

export const MileageForm = ({
  defaultValue,
  onSubmit,
}: {
  defaultValue: number;
  onSubmit: (values: MileageValues) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MileageValues>({
    resolver: zodResolver(MileageSchema),
    defaultValues: {
      odometer: defaultValue,
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form className="space-y-5" onSubmit={submitHandler}>
      <div>
        <label className="mb-2 block text-sm text-white/70">New mileage</label>
        <Input
          type="number"
          min="0"
          {...register("odometer", { valueAsNumber: true })}
        />
        {errors.odometer && (
          <p className="mt-1 text-xs text-red-400">{errors.odometer.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Update mileage
      </Button>
    </form>
  );
};
