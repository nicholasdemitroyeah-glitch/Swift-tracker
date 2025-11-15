"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AddLoadSchema = z.object({
  title: z.string().min(2, "Add a name"),
  stopCount: z
    .number({ invalid_type_error: "Required" })
    .min(1, "At least one stop"),
});

type AddLoadValues = z.infer<typeof AddLoadSchema>;

export const AddLoadForm = ({
  onSubmit,
}: {
  onSubmit: (values: AddLoadValues) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddLoadValues>({
    resolver: zodResolver(AddLoadSchema),
    defaultValues: {
      title: "New load",
      stopCount: 1,
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
          Load nickname
        </label>
        <Input placeholder="Phoenix to Denver" {...register("title")} />
        {errors.title && (
          <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Number of stops
        </label>
        <Input
          type="number"
          min="1"
          max="10"
          {...register("stopCount", { valueAsNumber: true })}
        />
        {errors.stopCount && (
          <p className="mt-1 text-xs text-red-400">
            {errors.stopCount.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Save load
      </Button>
    </form>
  );
};
