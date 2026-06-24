"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPlanPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Plan name is required"); return; }
    setLoading(true);
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const plan = await res.json();
      router.push(`/plans/${plan.id}/edit`);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create plan");
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-lg">‹</button>
        <h1 className="text-white font-bold text-xl">New Plan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Plan Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
            placeholder="e.g. My PPL Split, Bulk Phase, Cut Phase..."
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Description <span className="text-slate-600">(optional)</span></label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none"
            placeholder="What's this plan for? Goals, duration, notes..."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Creating..." : "Create Plan & Add Days →"}
        </button>
      </form>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
        <p className="text-slate-400 text-sm font-medium mb-1">💡 How it works</p>
        <p className="text-slate-500 text-xs leading-relaxed">
          After creating the plan, you&apos;ll be taken to the plan editor where you can add training days and exercises to each day.
        </p>
      </div>
    </div>
  );
}
