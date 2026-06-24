import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const plan = await prisma.workoutPlan.findUnique({
    where: { id: planId },
    include: {
      workoutDays: {
        orderBy: { dayNumber: "asc" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ planId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || (plan.userId !== session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, description } = await req.json();
  const updated = await prisma.workoutPlan.update({
    where: { id: planId },
    data: { name, description },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ planId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Unset active plan if user is using this plan
  await prisma.user.updateMany({
    where: { activePlanId: planId },
    data: { activePlanId: null },
  });

  await prisma.workoutPlan.delete({ where: { id: planId } });
  return NextResponse.json({ ok: true });
}
