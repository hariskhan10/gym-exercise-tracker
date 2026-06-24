import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ planId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId } = await params;

  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { dayNumber, label, focus, isRest } = await req.json();

  const day = await prisma.workoutDay.create({
    data: { planId, dayNumber: Number(dayNumber), label, focus: focus || null, isRest: isRest ?? false },
    include: { exercises: true },
  });

  return NextResponse.json(day);
}
