"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { UserSettings } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SettingsSchema = z.object({
  cpm: z
    .number({ invalid_type_error: "Required" })
    .min(10, "CPM should be at least 10¢")
    .max(500, "CPM seems too high"),
  payPerLoad: z
    .number({ invalid_type_error: "Required" })
    .min(0, "Can't be negative"),
  payPerStop: z
    .number({ invalid_type_error: "Required" })
    .min(0, "Can't be negative"),
});

type SettingsFormValues = z.infer<typeof SettingsSchema>;

type SettingsFormProps = {
  initialValues?: UserSettings | null;
  onSave: (values: UserSettings) => Promise<void>;
  submitLabel?: string;
};

export const SettingsForm = ({
  initialValues,
  onSave,
  submitLabel = "Save settings",
}: SettingsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      cpm: initialValues?.cpm ?? 50,
      payPerLoad: initialValues?.payPerLoad ?? 75,
      payPerStop: initialValues?.payPerStop ?? 25,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await onSave({
      ...values,
      cpm: Math.round(values.cpm),
      payPerLoad: Number(values.payPerLoad),
      payPerStop: Number(values.payPerStop),
    });
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="mb-2 block text-sm text-white/70">
          CPM (cents per mile)
        </label>
        <Input
          type="number"
          step="1"
          min="10"
          {...register("cpm", { valueAsNumber: true })}
        />
        {errors.cpm && (
          <p className="mt-1 text-xs text-red-400">{errors.cpm.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Pay per load ($)
        </label>
        <Input
          type="number"
          step="1"
          min="0"
          {...register("payPerLoad", { valueAsNumber: true })}
        />
        {errors.payPerLoad && (
          <p className="mt-1 text-xs text-red-400">
            {errors.payPerLoad.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Pay per stop ($)
        </label>
        <Input
          type="number"
          step="1"
          min="0"
          {...register("payPerStop", { valueAsNumber: true })}
        />
        {errors.payPerStop && (
          <p className="mt-1 text-xs text-red-400">
            {errors.payPerStop.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
};
