"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  youtubeUrl: string | null;
  notes: string | null;
};

type WorkoutDay = {
  id: string;
  dayNumber: number;
  label: string;
  focus: string | null;
  isRest: boolean;
  exercises: Exercise[];
};

type Plan = {
  id: string;
  name: string;
  description: string | null;
  workoutDays: WorkoutDay[];
};

const MUSCLE_GROUPS = [
  "Chest", "Back", "Shoulders", "Triceps", "Biceps",
  "Quads", "Hamstrings", "Calves", "Glutes", "Core",
  "Full Body", "Cardio", "Mobility", "Rear Delts", "Other",
];

function ExerciseForm({
  dayId,
  planId,
  onSave,
  onCancel,
  initial,
  exerciseId,
}: {
  dayId: string;
  planId: string;
  onSave: (ex: Exercise) => void;
  onCancel: () => void;
  initial?: Exercise;
  exerciseId?: string;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    muscleGroup: initial?.muscleGroup ?? "Chest",
    sets: initial?.sets?.toString() ?? "3",
    reps: initial?.reps ?? "8-10",
    youtubeUrl: initial?.youtubeUrl ?? "",
    notes: initial?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const url = exerciseId
      ? `/api/plans/${planId}/days/${dayId}/exercises/${exerciseId}`
      : `/api/plans/${planId}/days/${dayId}/exercises`;
    const method = exerciseId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const ex = await res.json();
      onSave(ex);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="bg-slate-900 rounded-xl p-4 space-y-3 border border-slate-700">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="text-xs text-slate-500 block mb-1">Exercise Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            placeholder="e.g. Barbell Bench Press"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Muscle Group</label>
          <select
            value={form.muscleGroup}
            onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          >
            {MUSCLE_GROUPS.map((mg) => <option key={mg} value={mg}>{mg}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Sets</label>
          <input
            type="number"
            value={form.sets}
            onChange={(e) => setForm({ ...form, sets: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            min="1" max="20"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-500 block mb-1">Reps / Duration</label>
          <input
            type="text"
            value={form.reps}
            onChange={(e) => setForm({ ...form, reps: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            placeholder="e.g. 8-10, 12, 30 sec, 20 min"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-500 block mb-1">YouTube URL <span className="text-slate-600">(optional)</span></label>
          <input
            type="url"
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-500 block mb-1">Notes <span className="text-slate-600">(optional)</span></label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            placeholder="Cues, variations, tips..."
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          {saving ? "Saving..." : exerciseId ? "Update" : "Add Exercise"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function DayForm({
  planId,
  onSave,
  onCancel,
  initial,
  dayId,
}: {
  planId: string;
  onSave: (day: WorkoutDay) => void;
  onCancel: () => void;
  initial?: WorkoutDay;
  dayId?: string;
}) {
  const [form, setForm] = useState({
    dayNumber: initial?.dayNumber?.toString() ?? "1",
    label: initial?.label ?? "",
    focus: initial?.focus ?? "",
    isRest: initial?.isRest ?? false,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim()) return;
    setSaving(true);

    const url = dayId
      ? `/api/plans/${planId}/days/${dayId}`
      : `/api/plans/${planId}/days`;
    const method = dayId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, dayNumber: parseInt(form.dayNumber) }),
    });

    if (res.ok) {
      const day = await res.json();
      onSave(day);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="bg-slate-900 rounded-xl p-4 space-y-3 border border-violet-800/40">
      <p className="text-white font-semibold text-sm">{dayId ? "Edit Day" : "Add Day"}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Day #</label>
          <input
            type="number"
            value={form.dayNumber}
            onChange={(e) => setForm({ ...form, dayNumber: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            min="1" max="14"
          />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isRest}
              onChange={(e) => setForm({ ...form, isRest: e.target.checked })}
              className="w-4 h-4 accent-violet-500"
            />
            <span className="text-slate-400 text-sm">Rest Day</span>
          </label>
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-500 block mb-1">Label *</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            placeholder="e.g. Day 1 – Push, Leg Day, Upper Body..."
            required
            autoFocus
          />
        </div>
        {!form.isRest && (
          <div className="col-span-2">
            <label className="text-xs text-slate-500 block mb-1">Focus <span className="text-slate-600">(optional)</span></label>
            <input
              type="text"
              value={form.focus}
              onChange={(e) => setForm({ ...form, focus: e.target.value })}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
              placeholder="e.g. Chest, Shoulders, Triceps"
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          {saving ? "Saving..." : dayId ? "Update Day" : "Add Day"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function PlanEditor({ plan: initialPlan }: { plan: Plan }) {
  const router = useRouter();
  const [plan, setPlan] = useState(initialPlan);
  const [planName, setPlanName] = useState(initialPlan.name);
  const [planDesc, setPlanDesc] = useState(initialPlan.description ?? "");
  const [editingHeader, setEditingHeader] = useState(false);
  const [addingDay, setAddingDay] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [addingExerciseTo, setAddingExerciseTo] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<{ dayId: string; exercise: Exercise } | null>(null);
  const [deletingDay, setDeletingDay] = useState<string | null>(null);
  const [deletingExercise, setDeletingExercise] = useState<string | null>(null);
  const [savingHeader, setSavingHeader] = useState(false);

  async function saveHeader() {
    setSavingHeader(true);
    const res = await fetch(`/api/plans/${plan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: planName, description: planDesc }),
    });
    if (res.ok) setEditingHeader(false);
    setSavingHeader(false);
  }

  function addDay(day: WorkoutDay) {
    setPlan((p) => ({
      ...p,
      workoutDays: [...p.workoutDays, { ...day, exercises: [] }].sort((a, b) => a.dayNumber - b.dayNumber),
    }));
    setAddingDay(false);
  }

  function updateDay(updated: WorkoutDay) {
    setPlan((p) => ({
      ...p,
      workoutDays: p.workoutDays.map((d) => d.id === updated.id ? { ...updated, exercises: d.exercises } : d),
    }));
    setEditingDay(null);
  }

  async function deleteDay(dayId: string) {
    setDeletingDay(dayId);
    await fetch(`/api/plans/${plan.id}/days/${dayId}`, { method: "DELETE" });
    setPlan((p) => ({ ...p, workoutDays: p.workoutDays.filter((d) => d.id !== dayId) }));
    setDeletingDay(null);
  }

  function addExercise(dayId: string, exercise: Exercise) {
    setPlan((p) => ({
      ...p,
      workoutDays: p.workoutDays.map((d) =>
        d.id === dayId ? { ...d, exercises: [...d.exercises, exercise] } : d
      ),
    }));
    setAddingExerciseTo(null);
  }

  function updateExercise(dayId: string, exercise: Exercise) {
    setPlan((p) => ({
      ...p,
      workoutDays: p.workoutDays.map((d) =>
        d.id === dayId
          ? { ...d, exercises: d.exercises.map((e) => e.id === exercise.id ? exercise : e) }
          : d
      ),
    }));
    setEditingExercise(null);
  }

  async function deleteExercise(dayId: string, exerciseId: string) {
    setDeletingExercise(exerciseId);
    await fetch(`/api/plans/${plan.id}/days/${dayId}/exercises/${exerciseId}`, { method: "DELETE" });
    setPlan((p) => ({
      ...p,
      workoutDays: p.workoutDays.map((d) =>
        d.id === dayId ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) } : d
      ),
    }));
    setDeletingExercise(null);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/plans" className="text-slate-400 hover:text-white text-lg">‹</Link>
        <h1 className="text-white font-bold text-xl flex-1">Edit Plan</h1>
        <Link
          href={`/plans/${plan.id}`}
          className="text-violet-400 text-sm hover:text-violet-300"
        >
          Preview
        </Link>
      </div>

      {/* Plan header */}
      {editingHeader ? (
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-violet-700/50 space-y-3">
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 font-semibold"
            placeholder="Plan name"
          />
          <textarea
            value={planDesc}
            onChange={(e) => setPlanDesc(e.target.value)}
            className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 resize-none"
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={saveHeader}
              disabled={savingHeader}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl"
            >
              {savingHeader ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditingHeader(false)} className="px-4 bg-slate-700 text-slate-300 text-sm rounded-xl">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditingHeader(true)}
          className="w-full flex items-center justify-between bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30 hover:border-slate-600 text-left group"
        >
          <div>
            <p className="text-white font-semibold">{plan.name}</p>
            {plan.description && <p className="text-slate-400 text-xs mt-0.5">{plan.description}</p>}
          </div>
          <span className="text-slate-600 group-hover:text-slate-400 text-sm">✎</span>
        </button>
      )}

      {/* Days */}
      <div className="space-y-4">
        {plan.workoutDays.map((day) => (
          <div key={day.id} className="bg-slate-800/60 rounded-2xl border border-slate-700/30 overflow-hidden">
            {editingDay === day.id ? (
              <div className="p-3">
                <DayForm
                  planId={plan.id}
                  dayId={day.id}
                  initial={day}
                  onSave={updateDay}
                  onCancel={() => setEditingDay(null)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 pb-2">
                <div>
                  <p className="text-white font-semibold text-sm">{day.label}</p>
                  {day.focus && <p className="text-slate-400 text-xs">{day.focus}</p>}
                  {day.isRest && <p className="text-slate-500 text-xs italic">Rest day</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingDay(day.id)}
                    className="text-slate-500 hover:text-slate-300 text-sm p-1"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteDay(day.id)}
                    disabled={deletingDay === day.id}
                    className="text-red-500 hover:text-red-400 text-sm p-1 disabled:opacity-50"
                  >
                    {deletingDay === day.id ? "…" : "✕"}
                  </button>
                </div>
              </div>
            )}

            {/* Exercises */}
            {day.exercises.length > 0 && (
              <div className="border-t border-slate-700/40 divide-y divide-slate-700/20 mx-1">
                {day.exercises.map((ex) => (
                  <div key={ex.id}>
                    {editingExercise?.exercise.id === ex.id ? (
                      <div className="p-3">
                        <ExerciseForm
                          dayId={day.id}
                          planId={plan.id}
                          exerciseId={ex.id}
                          initial={ex}
                          onSave={(updated) => updateExercise(day.id, updated)}
                          onCancel={() => setEditingExercise(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-300 text-xs font-medium truncate">{ex.name}</p>
                          <p className="text-slate-500 text-xs">{ex.muscleGroup} · {ex.sets}×{ex.reps}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {ex.youtubeUrl && <span className="text-xs text-violet-500">▶</span>}
                          <button
                            onClick={() => setEditingExercise({ dayId: day.id, exercise: ex })}
                            className="text-slate-600 hover:text-slate-300 p-1 text-xs"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => deleteExercise(day.id, ex.id)}
                            disabled={deletingExercise === ex.id}
                            className="text-red-600 hover:text-red-400 p-1 text-xs disabled:opacity-50"
                          >
                            {deletingExercise === ex.id ? "…" : "✕"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add exercise */}
            <div className="px-3 pb-3 pt-2">
              {addingExerciseTo === day.id ? (
                <ExerciseForm
                  dayId={day.id}
                  planId={plan.id}
                  onSave={(ex) => addExercise(day.id, ex)}
                  onCancel={() => setAddingExerciseTo(null)}
                />
              ) : !day.isRest ? (
                <button
                  onClick={() => {
                    setAddingExerciseTo(day.id);
                    setAddingDay(false);
                    setEditingExercise(null);
                  }}
                  className="w-full border border-dashed border-slate-700 hover:border-violet-600 text-slate-500 hover:text-violet-400 text-sm py-2 rounded-xl transition-colors"
                >
                  + Add Exercise
                </button>
              ) : null}
            </div>
          </div>
        ))}

        {/* Add day */}
        {addingDay ? (
          <DayForm
            planId={plan.id}
            onSave={addDay}
            onCancel={() => setAddingDay(false)}
          />
        ) : (
          <button
            onClick={() => { setAddingDay(true); setAddingExerciseTo(null); }}
            className="w-full border border-dashed border-slate-700 hover:border-violet-600 text-slate-500 hover:text-violet-400 text-sm py-3 rounded-2xl transition-colors"
          >
            + Add Day
          </button>
        )}
      </div>

      <div className="flex gap-3 pb-4">
        <Link
          href={`/plans/${plan.id}`}
          className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium py-3 rounded-xl transition-colors"
        >
          Done Editing
        </Link>
        <button
          onClick={() => router.push("/plans")}
          className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
}
