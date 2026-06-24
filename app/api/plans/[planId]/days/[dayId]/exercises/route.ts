import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ planId: string; dayId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId, dayId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, muscleGroup, sets, reps, youtubeUrl, mediaUrl, notes } = await req.json();

  const count = await prisma.exercise.count({ where: { dayId } });

  const exercise = await prisma.exercise.create({
    data: {
      dayId,
      name,
      muscleGroup,
      sets: Number(sets),
      reps,
      youtubeUrl: youtubeUrl || null,
      mediaUrl: mediaUrl || null,
      notes: notes || null,
      order: count + 1,
    },
  });

  return NextResponse.json(exercise);
}
