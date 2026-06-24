"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AssignPlanButton({ planId, isActive }: { planId: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function assign() {
    setLoading(true);
    await fetch(`/api/plans/${planId}/assign`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  if (isActive) {
    return (
      <div className="flex-1 text-center bg-emerald-900/40 text-emerald-400 text-sm py-2 rounded-xl border border-emerald-800/40 cursor-default">
        ✓ Using this
      </div>
    );
  }

  return (
    <button
      onClick={assign}
      disabled={loading}
      className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
    >
      {loading ? "Setting..." : "Use Plan"}
    </button>
  );
}
