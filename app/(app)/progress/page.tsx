import { auth } from "@/auth";
import { prisma } from "@/lib/db";

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const last7 = getLast7Days();

  const logs = await prisma.exerciseLog.findMany({
    where: {
      userId: session.user.id,
      date: { in: last7 },
      completed: true,
    },
    include: {
      exercise: {
        include: { day: { select: { label: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const logsByDate = new Map<string, typeof logs>();
  for (const log of logs) {
    if (!logsByDate.has(log.date)) logsByDate.set(log.date, []);
    logsByDate.get(log.date)!.push(log);
  }

  const totalCompleted = logs.length;
  const activeDays = logsByDate.size;

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logsByDate.get(today) ?? [];

  return (
    <div className="p-4 space-y-6">
      <div className="pt-2">
        <h1 className="text-white font-bold text-xl">Progress</h1>
        <p className="text-slate-400 text-sm">Last 7 days</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/60 rounded-2xl p-3 text-center border border-slate-700/30">
          <p className="text-2xl font-bold text-violet-400">{activeDays}</p>
          <p className="text-slate-400 text-xs mt-0.5">Active Days</p>
        </div>
        <div className="bg-slate-800/60 rounded-2xl p-3 text-center border border-slate-700/30">
          <p className="text-2xl font-bold text-emerald-400">{totalCompleted}</p>
          <p className="text-slate-400 text-xs mt-0.5">Exercises Done</p>
        </div>
        <div className="bg-slate-800/60 rounded-2xl p-3 text-center border border-slate-700/30">
          <p className="text-2xl font-bold text-yellow-400">{todayLogs.length}</p>
          <p className="text-slate-400 text-xs mt-0.5">Today</p>
        </div>
      </div>

      {/* 7-day heatmap */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30">
        <h2 className="text-slate-300 text-sm font-semibold mb-3">Daily Activity</h2>
        <div className="flex gap-2 justify-between">
          {last7.map((date) => {
            const count = logsByDate.get(date)?.length ?? 0;
            const isToday = date === today;
            const dayLabel = new Date(date + "T12:00:00").toLocaleDateString("en", { weekday: "short" });
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full aspect-square rounded-lg ${
                    count === 0 ? "bg-slate-700" :
                    count < 4 ? "bg-violet-700" :
                    count < 8 ? "bg-violet-500" : "bg-emerald-500"
                  } ${isToday ? "ring-2 ring-white ring-offset-1 ring-offset-slate-800" : ""}`}
                />
                <span className="text-slate-500 text-[10px]">{dayLabel}</span>
                <span className="text-slate-400 text-[10px]">{count > 0 ? count : ""}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wider">Recent Activity</h2>
        {last7.reverse().map((date) => {
          const dayLogs = logsByDate.get(date);
          if (!dayLogs?.length) return null;
          const label = new Date(date + "T12:00:00").toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" });
          const isToday = date === today;

          return (
            <div key={date} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-slate-400 text-xs font-medium">{isToday ? "Today" : label}</p>
                <span className="text-emerald-400 text-xs">·  {dayLogs.length} done</span>
              </div>
              <div className="space-y-2">
                {dayLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3 border border-slate-700/30">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{log.exercise.name}</p>
                      <p className="text-slate-500 text-xs">{log.exercise.muscleGroup}</p>
                    </div>
                    {(log.actualSets || log.actualReps) && (
                      <span className="text-slate-400 text-xs font-mono">
                        {log.actualSets}×{log.actualReps}
                        {log.weight ? ` @ ${log.weight}kg` : ""}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🏋️</p>
            <p className="text-slate-400 text-sm">No workouts logged yet.</p>
            <p className="text-slate-500 text-xs mt-1">Complete your first workout to see progress here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
