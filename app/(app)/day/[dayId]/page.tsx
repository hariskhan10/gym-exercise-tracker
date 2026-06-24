import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { DayWorkout } from "./DayWorkout";

export default async function DayPage({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  const session = await auth();

  const day = await prisma.workoutDay.findUnique({
    where: { id: dayId },
    include: {
      exercises: { orderBy: { order: "asc" } },
      plan: { select: { name: true } },
    },
  });

  if (!day) notFound();

  const today = new Date().toISOString().split("T")[0];

  const logs = session?.user?.id
    ? await prisma.exerciseLog.findMany({
        where: { userId: session.user.id, date: today },
      })
    : [];

  return <DayWorkout day={day} initialLogs={logs} userId={session?.user?.id ?? ""} />;
}
