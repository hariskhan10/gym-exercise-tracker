import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ planId: string; dayId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId, dayId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { label, focus, isRest } = await req.json();
  const day = await prisma.workoutDay.update({
    where: { id: dayId },
    data: { label, focus, isRest },
    include: { exercises: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(day);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ planId: string; dayId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId, dayId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.workoutDay.delete({ where: { id: dayId } });
  return NextResponse.json({ ok: true });
}
