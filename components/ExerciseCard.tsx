"use client";
import { useState } from "react";

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

type Props = {
  exercise: Exercise;
  log?: ExerciseLog;
  isSaving: boolean;
  onToggle: (exercise: Exercise, data?: { actualSets?: number; actualReps?: string; weight?: number; notes?: string }) => void;
  onMedia: () => void;
};

const muscleColors: Record<string, string> = {
  Chest: "text-red-400",
  Back: "text-blue-400",
  Shoulders: "text-yellow-400",
  Triceps: "text-orange-400",
  Biceps: "text-green-400",
  Quads: "text-purple-400",
  Hamstrings: "text-pink-400",
  Calves: "text-teal-400",
  Glutes: "text-rose-400",
  Cardio: "text-cyan-400",
  Mobility: "text-emerald-400",
  "Full Body": "text-slate-300",
  "Rear Delts": "text-amber-400",
};

export function ExerciseCard({ exercise, log, isSaving, onToggle, onMedia }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [actualSets, setActualSets] = useState(log?.actualSets?.toString() ?? exercise.sets.toString());
  const [actualReps, setActualReps] = useState(log?.actualReps ?? exercise.reps);
  const [weight, setWeight] = useState(log?.weight?.toString() ?? "");
  const [notes, setNotes] = useState(log?.notes ?? "");

  const completed = log?.completed ?? false;
  const hasMedia = exercise.youtubeUrl || exercise.mediaUrl;
  const muscleColor = muscleColors[exercise.muscleGroup] ?? "text-slate-400";

  function handleToggle() {
    onToggle(exercise, {
      actualSets: parseInt(actualSets) || exercise.sets,
      actualReps: actualReps || exercise.reps,
      weight: weight ? parseFloat(weight) : undefined,
      notes: notes || undefined,
    });
  }

  return (
    <div className={`rounded-xl border transition-all ${
      completed
        ? "bg-emerald-950/30 border-emerald-800/40"
        : "bg-slate-800/60 border-slate-700/30"
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={isSaving}
            className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              completed
                ? "bg-emerald-500 border-emerald-500"
                : "border-slate-600 hover:border-violet-400"
            } ${isSaving ? "opacity-50" : ""}`}
          >
            {completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Exercise info */}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm leading-tight ${completed ? "text-slate-400 line-through" : "text-white"}`}>
              {exercise.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${muscleColor}`}>{exercise.muscleGroup}</span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-slate-400 text-xs font-mono">{exercise.sets}×{exercise.reps}</span>
            </div>
            {log?.completed && log.weight && (
              <p className="text-xs text-slate-500 mt-0.5">{log.actualSets}×{log.actualReps} @ {log.weight}kg</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {hasMedia && (
              <button
                onClick={onMedia}
                className="text-violet-400 hover:text-violet-300 transition-colors p-1"
                title="View reference"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {exercise.notes && !expanded && (
          <p className="text-slate-500 text-xs mt-2 ml-9 italic">{exercise.notes}</p>
        )}
      </div>

      {/* Expanded: log actual performance */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/40 pt-3 space-y-3">
          {exercise.notes && <p className="text-slate-400 text-xs italic">{exercise.notes}</p>}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Sets</label>
              <input
                type="number"
                value={actualSets}
                onChange={(e) => setActualSets(e.target.value)}
                className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
                min="1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Reps</label>
              <input
                type="text"
                value={actualReps}
                onChange={(e) => setActualReps(e.target.value)}
                className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder={exercise.reps}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="How did it feel?"
            />
          </div>
          <button
            onClick={handleToggle}
            disabled={isSaving}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              completed
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            {isSaving ? "Saving..." : completed ? "Mark Incomplete" : "Mark Complete"}
          </button>
        </div>
      )}
    </div>
  );
}
