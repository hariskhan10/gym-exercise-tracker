import { auth } from "@/auth";
import { getActivePlan } from "@/lib/getActivePlan";
import Link from "next/link";

const dayEmojis: Record<number, string> = {
  1: "🔴", 2: "🔵", 3: "🟣", 4: "🔴", 5: "🔵", 6: "🟣", 7: "⚪",
};

export default async function WeekPage() {
  const session = await auth();
  const plan = session?.user?.id ? await getActivePlan(session.user.id) : null;

  const today = new Date().getDay();
  const todayDayNum = today === 0 ? 7 : today;

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-white font-bold text-xl">Weekly Plan</h1>
        <p className="text-slate-400 text-sm">{plan?.name}</p>
      </div>

      <div className="space-y-3">
        {plan?.workoutDays.map((day) => {
          const isToday = day.dayNumber === todayDayNum;
          const muscleGroups = [...new Set(day.exercises.map((e) => e.muscleGroup))];

          return (
            <Link
              key={day.id}
              href={`/day/${day.id}`}
              className={`block rounded-2xl border p-4 transition-all ${
                isToday
                  ? "bg-violet-900/30 border-violet-700/50"
                  : "bg-slate-800/60 border-slate-700/30 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isToday ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-300"
                  }`}>
                    {dayEmojis[day.dayNumber]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm">{day.label}</p>
                      {isToday && (
                        <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">Today</span>
                      )}
                    </div>
                    {day.focus && <p className="text-slate-400 text-xs">{day.focus}</p>}
                  </div>
                </div>
                <span className="text-slate-600">›</span>
              </div>

              {!day.isRest && (
                <div className="mt-3 ml-13 pl-0">
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {muscleGroups.slice(0, 5).map((mg) => (
                      <span key={mg} className="text-xs bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full">
                        {mg}
                      </span>
                    ))}
                    {muscleGroups.length > 5 && (
                      <span className="text-xs text-slate-500">+{muscleGroups.length - 5} more</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-2">{day.exercises.length} exercises</p>
                </div>
              )}

              {day.isRest && (
                <div className="mt-3">
                  <div className="flex gap-2">
                    <span className="text-xs bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full">Recovery Walk</span>
                    <span className="text-xs bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full">Stretching</span>
                    <span className="text-xs bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full">Mobility</span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
