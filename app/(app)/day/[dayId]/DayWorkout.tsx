"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExerciseCard } from "@/components/ExerciseCard";
import { MediaModal } from "@/components/MediaModal";

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  youtubeUrl: string | null;
  mediaUrl: string | null;
  notes: string | null;
};

type ExerciseLog = {
  id: string;
  exerciseId: string;
  completed: boolean;
  actualSets: number | null;
  actualReps: string | null;
  weight: number | null;
  notes: string | null;
};

type WorkoutDay = {
  id: string;
  label: string;
  focus: string | null;
  isRest: boolean;
  exercises: Exercise[];
  plan: { name: string };
};

type Props = {
  day: WorkoutDay;
  initialLogs: ExerciseLog[];
  userId: string;
};

export function DayWorkout({ day, initialLogs, userId }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [logs, setLogs] = useState<Map<string, ExerciseLog>>(
    new Map(initialLogs.map((l) => [l.exerciseId, l]))
  );
  const [mediaExercise, setMediaExercise] = useState<Exercise | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const completedCount = day.exercises.filter((e) => logs.get(e.id)?.completed).length;
  const pct = day.exercises.length > 0
    ? Math.round((completedCount / day.exercises.length) * 100)
    : 0;

  async function toggleExercise(exercise: Exercise, data?: { actualSets?: number; actualReps?: string; weight?: number; notes?: string }) {
    if (!userId) return;
    const current = logs.get(exercise.id);
    const newCompleted = !current?.completed;

    setSaving(exercise.id);

    const body = {
      exerciseId: exercise.id,
      date: today,
      completed: newCompleted,
      actualSets: data?.actualSets ?? exercise.sets,
      actualReps: data?.actualReps ?? exercise.reps,
      weight: data?.weight ?? null,
      notes: data?.notes ?? null,
    };

    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const log = await res.json();
      setLogs((prev) => new Map(prev).set(exercise.id, log));
    }
    setSaving(null);
  }

  const muscleGroups = [...new Set(day.exercises.map((e) => e.muscleGroup))];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => { router.refresh(); router.back(); }}
          className="text-slate-400 hover:text-white text-lg"
        >‹</button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg leading-tight">{day.label}</h1>
          {day.focus && <p className="text-slate-400 text-sm">{day.focus}</p>}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">{completedCount} / {day.exercises.length} completed</span>
          <span className={`font-bold ${pct === 100 ? "text-emerald-400" : "text-violet-400"}`}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-violet-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-emerald-400 text-sm font-medium text-center mt-2">Workout complete! 🎉</p>
        )}
      </div>

      {/* Muscle group tags */}
      <div className="flex gap-2 flex-wrap">
        {muscleGroups.map((mg) => (
          <span key={mg} className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full">
            {mg}
          </span>
        ))}
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {day.exercises.map((exercise) => {
          const log = logs.get(exercise.id);
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              log={log}
              isSaving={saving === exercise.id}
              onToggle={toggleExercise}
              onMedia={() => setMediaExercise(exercise)}
            />
          );
        })}
      </div>

      {/* Media modal */}
      {mediaExercise && (
        <MediaModal
          exercise={mediaExercise}
          onClose={() => setMediaExercise(null)}
        />
      )}
    </div>
  );
}
