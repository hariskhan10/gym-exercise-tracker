import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ planId: string; exerciseId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId, exerciseId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, muscleGroup, sets, reps, youtubeUrl, mediaUrl, notes } = await req.json();
  const exercise = await prisma.exercise.update({
    where: { id: exerciseId },
    data: { name, muscleGroup, sets: Number(sets), reps, youtubeUrl: youtubeUrl || null, mediaUrl: mediaUrl || null, notes: notes || null },
  });
  return NextResponse.json(exercise);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ planId: string; exerciseId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId, exerciseId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.exercise.delete({ where: { id: exerciseId } });
  return NextResponse.json({ ok: true });
}
