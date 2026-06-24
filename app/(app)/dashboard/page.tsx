import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getActivePlan } from "@/lib/getActivePlan";
import Link from "next/link";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getDayOfWeek() {
  // 0=Sun, 1=Mon ... 6=Sat → map to our day numbers 1-7
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
}

const muscleColors: Record<string, string> = {
  Chest: "bg-red-900/40 text-red-300",
  Back: "bg-blue-900/40 text-blue-300",
  Shoulders: "bg-yellow-900/40 text-yellow-300",
  Triceps: "bg-orange-900/40 text-orange-300",
  Biceps: "bg-green-900/40 text-green-300",
  Quads: "bg-purple-900/40 text-purple-300",
  Hamstrings: "bg-pink-900/40 text-pink-300",
  Calves: "bg-teal-900/40 text-teal-300",
  Glutes: "bg-rose-900/40 text-rose-300",
  Cardio: "bg-cyan-900/40 text-cyan-300",
  Mobility: "bg-emerald-900/40 text-emerald-300",
  "Full Body": "bg-slate-700/60 text-slate-300",
  "Rear Delts": "bg-amber-900/40 text-amber-300",
};

export default async function DashboardPage() {
  const session = await auth();
  const today = getTodayDate();
  const dayNum = getDayOfWeek();

  const plan = session?.user?.id ? await getActivePlan(session.user.id) : null;

  const todayDay = plan?.workoutDays.find((d: { dayNumber: number }) => d.dayNumber === dayNum);

  const logs = session?.user?.id
    ? await prisma.exerciseLog.findMany({ where: { userId: session.user.id, date: today } })
    : [];

  const logMap = new Map(logs.map((l) => [l.exerciseId, l]));
  const completedCount = todayDay?.exercises.filter((e) => logMap.get(e.id)?.completed).length ?? 0;
  const totalCount = todayDay?.exercises.length ?? 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Fetch image from DB — not from JWT (base64 images would bloat the cookie)
  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { image: true } })
    : null;

  const user = { ...session?.user, image: dbUser?.image ?? null };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-slate-400 text-sm">Welcome back,</p>
          <h1 className="text-xl font-bold text-white">{user?.name || "Athlete"} 💪</h1>
        </div>
        <Link href="/profile">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
              {(user?.name?.[0] || user?.email?.[0] || "?").toUpperCase()}
            </div>
          )}
        </Link>
      </div>

      {/* Active plan banner */}
      {plan && (
        <Link href="/plans" className="flex items-center justify-between bg-slate-800/50 border border-slate-700/40 rounded-xl px-4 py-2.5">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Active Plan</p>
            <p className="text-white text-sm font-medium">{plan.name}</p>
          </div>
          <span className="text-violet-400 text-xs font-medium">Change →</span>
        </Link>
      )}

      {/* Today's workout card */}
      {todayDay ? (
        <div className="bg-gradient-to-br from-violet-900/50 to-slate-800 rounded-2xl p-5 border border-violet-800/40">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-violet-300 text-xs font-medium uppercase tracking-wider">Today</p>
              <h2 className="text-white font-bold text-lg">{todayDay.label}</h2>
              <p className="text-slate-400 text-sm">{todayDay.focus}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{pct}%</div>
              <div className="text-slate-400 text-xs">{completedCount}/{totalCount} done</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          <Link
            href={`/day/${todayDay.id}`}
            className="block w-full bg-violet-600 hover:bg-violet-500 text-white text-center font-semibold py-3 rounded-xl transition-colors"
          >
            {pct === 0 ? "Start Workout" : pct === 100 ? "Review Workout ✓" : "Continue Workout"}
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl p-5 text-center">
          <p className="text-4xl mb-2">😴</p>
          <p className="text-white font-semibold">Rest Day</p>
          <p className="text-slate-400 text-sm mt-1">Recovery is part of the plan</p>
        </div>
      )}

      {/* Weekly overview */}
      <div>
        <h2 className="text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">This Week</h2>
        <div className="grid grid-cols-1 gap-2">
          {plan?.workoutDays.map((day) => {
            const isToday = day.dayNumber === dayNum;
            return (
              <Link
                key={day.id}
                href={`/day/${day.id}`}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isToday
                    ? "bg-violet-900/30 border border-violet-700/50"
                    : "bg-slate-800/60 border border-slate-700/30 hover:bg-slate-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isToday ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-400"
                }`}>
                  {day.dayNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${isToday ? "text-white" : "text-slate-300"}`}>
                    {day.label}
                  </p>
                  {day.focus && <p className="text-slate-500 text-xs truncate">{day.focus}</p>}
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {day.isRest ? (
                    <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Rest</span>
                  ) : (
                    <span className="text-xs text-slate-500">{day.exercises.length} exercises</span>
                  )}
                </div>
                <span className="text-slate-600">›</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Muscle group legend */}
      <div>
        <h2 className="text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">Muscle Groups</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(muscleColors).map(([group, cls]) => (
            <span key={group} className={`text-xs px-2 py-1 rounded-full ${cls}`}>{group}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
