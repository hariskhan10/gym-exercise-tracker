import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { AssignPlanButton } from "../AssignPlanButton";

export default async function PlanDetailPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const session = await auth();

  const [plan, user] = await Promise.all([
    prisma.workoutPlan.findUnique({
      where: { id: planId },
      include: {
        workoutDays: {
          orderBy: { dayNumber: "asc" },
          include: { exercises: { orderBy: { order: "asc" } } },
        },
      },
    }),
    session?.user?.id
      ? prisma.user.findUnique({ where: { id: session.user.id }, select: { activePlanId: true } })
      : null,
  ]);

  if (!plan) notFound();

  const isActive = user?.activePlanId === plan.id;
  const isOwned = session?.user?.id && plan.userId === session.user.id;
  const totalExercises = plan.workoutDays.reduce((acc, d) => acc + d.exercises.length, 0);

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/plans" className="text-slate-400 hover:text-white text-lg">‹</Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-white font-bold text-xl">{plan.name}</h1>
            {isActive && <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">Active</span>}
          </div>
          {plan.description && <p className="text-slate-400 text-sm">{plan.description}</p>}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap text-xs text-slate-500">
        <span className="bg-slate-800 px-2 py-1 rounded-full">{plan.workoutDays.length} days</span>
        <span className="bg-slate-800 px-2 py-1 rounded-full">{totalExercises} exercises</span>
        {plan.isDefault && <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-full">Default plan</span>}
      </div>

      <div className="flex gap-2">
        <AssignPlanButton planId={plan.id} isActive={isActive} />
        {isOwned && (
          <Link
            href={`/plans/${plan.id}/edit`}
            className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2.5 rounded-xl transition-colors font-medium"
          >
            Edit Plan
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {plan.workoutDays.map((day) => (
          <div key={day.id} className="bg-slate-800/60 rounded-2xl border border-slate-700/30 overflow-hidden">
            <div className="flex items-center justify-between p-4 pb-3">
              <div>
                <p className="text-white font-semibold text-sm">{day.label}</p>
                {day.focus && <p className="text-slate-400 text-xs">{day.focus}</p>}
              </div>
              <span className="text-slate-500 text-xs">{day.exercises.length} exercises</span>
            </div>
            {day.exercises.length > 0 && (
              <div className="border-t border-slate-700/40 divide-y divide-slate-700/20">
                {day.exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <p className="text-slate-300 text-xs font-medium">{ex.name}</p>
                      <p className="text-slate-600 text-xs">{ex.muscleGroup}</p>
                    </div>
                    <span className="text-slate-500 text-xs font-mono">{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
              </div>
            )}
            {day.isRest && (
              <div className="border-t border-slate-700/40 px-4 py-3">
                <p className="text-slate-500 text-xs">Recovery day — walk, stretch, mobility</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
