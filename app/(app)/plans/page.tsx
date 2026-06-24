import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { AssignPlanButton } from "./AssignPlanButton";

export default async function PlansPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [defaultPlans, myPlans, user] = await Promise.all([
    prisma.workoutPlan.findMany({
      where: { isDefault: true },
      include: { workoutDays: { include: { exercises: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.workoutPlan.findMany({
      where: { userId: session.user.id },
      include: { workoutDays: { include: { exercises: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { activePlanId: true } }),
  ]);

  const activePlanId = user?.activePlanId;

  function PlanCard({ plan, isOwned }: { plan: typeof defaultPlans[0]; isOwned: boolean }) {
    const totalExercises = plan.workoutDays.reduce((acc, d) => acc + d.exercises.length, 0);
    const isActive = plan.id === activePlanId;
    return (
      <div className={`rounded-2xl border p-4 transition-all ${
        isActive ? "bg-violet-900/30 border-violet-700/50" : "bg-slate-800/60 border-slate-700/30"
      }`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold text-sm">{plan.name}</h3>
              {isActive && (
                <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full shrink-0">Active</span>
              )}
              {plan.isDefault && (
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full shrink-0">Default</span>
              )}
            </div>
            {plan.description && (
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{plan.description}</p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              {plan.workoutDays.length} days · {totalExercises} exercises
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <AssignPlanButton planId={plan.id} isActive={isActive} />
          <Link
            href={`/plans/${plan.id}`}
            className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 rounded-xl transition-colors"
          >
            View
          </Link>
          {isOwned && (
            <Link
              href={`/plans/${plan.id}/edit`}
              className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 rounded-xl transition-colors"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-white font-bold text-xl">Workout Plans</h1>
          <p className="text-slate-400 text-sm">Select or create your plan</p>
        </div>
        <Link
          href="/plans/new"
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + New
        </Link>
      </div>

      {myPlans.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">My Plans</h2>
          {myPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isOwned={true} />
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Default Plans</h2>
        {defaultPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} isOwned={false} />
        ))}
      </div>
    </div>
  );
}
