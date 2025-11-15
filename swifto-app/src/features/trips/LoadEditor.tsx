"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { TripLoad, TripLoadStop } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type LoadEditorProps = {
  load: TripLoad;
  onSave: (load: TripLoad) => Promise<void>;
};

export const LoadEditor = ({ load, onSave }: LoadEditorProps) => {
  const [draft, setDraft] = useState<TripLoad>(load);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(load);
  }, [load]);

  const updateStop = (stopId: string, updates: Partial<TripLoadStop>) => {
    setDraft((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) =>
        stop.id === stopId
          ? { ...stop, ...updates, updatedAt: Date.now() }
          : stop,
      ),
    }));
  };

  const addStop = () => {
    setDraft((prev) => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          id: crypto.randomUUID(),
          label: `Stop ${prev.stops.length + 1}`,
          location: "",
          notes: "",
          status: "planned",
          updatedAt: Date.now(),
        },
      ],
      stopCount: prev.stops.length + 1,
    }));
  };

  const removeStop = (stopId: string) => {
    setDraft((prev) => {
      const nextStops = prev.stops.filter((stop) => stop.id !== stopId);
      return {
        ...prev,
        stops: nextStops,
        stopCount: nextStops.length,
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...draft,
      title: draft.title.trim() || load.title,
      stopCount: draft.stops.length,
      updatedAt: Date.now(),
    });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-white/70">Load name</label>
        <Input
          value={draft.title}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/70">Stops</p>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
            onClick={addStop}
          >
            <Plus className="h-3.5 w-3.5" />
            Add stop
          </button>
        </div>

        <div className="space-y-3">
          {draft.stops.map((stop) => (
            <div
              key={stop.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={stop.label}
                  onChange={(e) =>
                    updateStop(stop.id, { label: e.target.value })
                  }
                  className="text-sm"
                />
                {draft.stops.length > 1 && (
                  <button
                    type="button"
                    className="rounded-full border border-white/10 p-2 text-white/60 hover:bg-white/10"
                    onClick={() => removeStop(stop.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Input
                className="mt-2 text-sm"
                placeholder="Location / notes"
                value={stop.location ?? ""}
                onChange={(e) =>
                  updateStop(stop.id, { location: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" onClick={handleSave} loading={saving}>
        Update load
      </Button>
    </div>
  );
};
